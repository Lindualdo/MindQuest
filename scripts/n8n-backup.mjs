import { mkdir, writeFile, rm, access, readdir, readFile, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';

const apiRoot = new URL('https://mindquest-n8n.cloudfy.live/api/v1/');
const apiKey = process.env.N8N_API_KEY;

if (!apiKey) {
  console.error('Defina a variável N8N_API_KEY antes de rodar.');
  process.exit(1);
}

const backupDir = path.resolve('backups/n8n');
const logFilePath = path.resolve('backups/n8n-backup.log.jsonl');
const pageLimit = Number(process.env.N8N_PAGE_LIMIT ?? '100');
const folderPageLimit = Number(process.env.N8N_FOLDER_PAGE_LIMIT ?? '100');
const PROJECT_ROOT_ID = '0';
const fieldsToRemove = new Set(['updatedAt', 'lastActiveAt']);

async function fileExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function fetchJson(relativePath, searchParams = {}) {
  const url = new URL(relativePath, apiRoot);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url, { headers: { 'X-N8N-API-KEY': apiKey } });

  if (!res.ok) {
    if (res.status === 401) {
      const errorBody = await res.text().catch(() => '');
      throw new Error(
        `Token N8N_API_KEY inválido ou expirado (401 Unauthorized). ` +
        `Atualize o token no keychain executando: ` +
        `security delete-generic-password -a "mindquest_backup_token" -s "mindquest_n8n_backup" && ./scripts/run-n8n-backup.sh\n` +
        `URL: ${url}\n` +
        `Resposta: ${errorBody}`
      );
    }
    throw new Error(`Falha ao acessar ${url}: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

function stripKeys(value) {
  if (Array.isArray(value)) {
    return value.map((item) => stripKeys(item));
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([key]) => !fieldsToRemove.has(key));
    return Object.fromEntries(entries.map(([key, val]) => [key, stripKeys(val)]));
  }

  return value;
}

async function paginate(resourcePath, baseParams = {}) {
  const items = [];
  let cursor;
  const baseSize = Number(baseParams.limit ?? pageLimit);
  const pageSize = Number.isFinite(baseSize) && baseSize > 0 ? baseSize : pageLimit;

  while (true) {
    const params = { ...baseParams };

    if (cursor) {
      params.cursor = cursor;
    }

    if (params.limit === undefined) {
      params.limit = String(pageSize);
    }

    const page = await fetchJson(resourcePath, params);
    const pageItems = Array.isArray(page?.data) ? page.data : [];
    items.push(...pageItems);

    const nextCursor =
      typeof page?.nextCursor === 'string' && page.nextCursor.length > 0 ? page.nextCursor : undefined;

    if (!nextCursor) {
      break;
    }

    cursor = nextCursor;
  }

  return items;
}

function sanitizeName(value, fallback) {
  const raw = (value ?? fallback ?? 'default').toString();
  const normalized = raw.normalize('NFKD').replace(/[^a-z0-9-_]+/gi, '_');
  const trimmed = normalized.replace(/^_+|_+$/g, '');
  return trimmed.length > 0 ? trimmed : fallback ?? 'default';
}

async function fetchProjectFolders(projectId) {
  if (!projectId) {
    return [];
  }

  const selectFields = JSON.stringify(['id', 'name', 'parentFolder', 'path']);
  return paginate(`projects/${projectId}/folders`, {
    select: selectFields,
    limit: String(folderPageLimit),
  });
}

function buildFolderPathIndex(folders = []) {
  const byId = new Map();

  folders.forEach((folder) => {
    if (!folder || typeof folder !== 'object' || !folder.id) return;
    const parentId =
      folder.parentFolder?.id ??
      folder.parentFolderId ??
      (typeof folder.parentFolderId === 'string' ? folder.parentFolderId : null);
    const name = folder.name ?? folder.id ?? 'sem-nome';
    byId.set(folder.id, {
      id: folder.id,
      name,
      parentId: parentId && parentId !== PROJECT_ROOT_ID ? parentId : null,
    });
  });

  const computed = new Map();
  const usedPaths = new Map();

  function compute(id) {
    if (!id || id === PROJECT_ROOT_ID) {
      return { sanitized: [], display: [] };
    }

    if (computed.has(id)) {
      return computed.get(id);
    }

    const record = byId.get(id);
    if (!record) {
      return null;
    }

    const parentResult =
      record.parentId && byId.has(record.parentId)
        ? compute(record.parentId)
        : { sanitized: [], display: [] };

    const parentSanitized = parentResult?.sanitized ?? [];
    const parentDisplay = parentResult?.display ?? [];

    const baseSanitized = sanitizeName(record.name, record.id);
    let sanitizedPart = baseSanitized;
    let candidate = [...parentSanitized, sanitizedPart];
    let key = candidate.join('/');
    let suffix = 1;

    while (usedPaths.has(key) && usedPaths.get(key) !== record.id) {
      suffix += 1;
      sanitizedPart = `${baseSanitized}-${suffix}`;
      candidate = [...parentSanitized, sanitizedPart];
      key = candidate.join('/');
    }

    usedPaths.set(key, record.id);
    const result = {
      sanitized: candidate,
      display: [...parentDisplay, record.name],
    };

    computed.set(id, result);
    return result;
  }

  for (const id of byId.keys()) {
    compute(id);
  }

  const records = [];
  for (const [id, record] of byId.entries()) {
    const resolved = computed.get(id) ?? { sanitized: [], display: [] };
    records.push({
      id,
      name: record.name,
      parentId: record.parentId,
      sanitizedPath: resolved.sanitized,
      displayPath: resolved.display,
    });
  }

  return {
    resolve(folderId, fallbackName) {
      if (!folderId || folderId === PROJECT_ROOT_ID) {
        return { sanitized: [], display: [] };
      }

      const resolved = compute(folderId);
      if (resolved) {
        return resolved;
      }

      const displayName = fallbackName ?? `folder-${folderId}`;
      const sanitizedName = sanitizeName(displayName, folderId);
      return { sanitized: [sanitizedName], display: [displayName] };
    },
    count: records.length,
    records,
  };
}

async function ensureFolderIndex(projectId, projectMeta, cache) {
  if (!cache || !projectId || projectId === 'default') {
    return null;
  }

  if (cache.has(projectId)) {
    return cache.get(projectId);
  }

  try {
    const folders = await fetchProjectFolders(projectId);
    const index = buildFolderPathIndex(folders);
    cache.set(projectId, index);

    if (projectMeta?.name) {
      console.log(
        `Pastas detectadas no projeto ${projectMeta.name} (#${projectId}): ${index.count}`,
      );
    } else {
      console.log(`Pastas detectadas no projeto ${projectId}: ${index.count}`);
    }

    return index;
  } catch (error) {
    console.warn(`Falha ao listar pastas do projeto ${projectId}:`, error);
    cache.set(projectId, null);
    return null;
  }
}

function resolveFolderPlacement(folderIndex, parentFolderId, fallbackName) {
  if (!parentFolderId || parentFolderId === PROJECT_ROOT_ID) {
    return { sanitized: [], display: [] };
  }

  if (folderIndex) {
    return folderIndex.resolve(parentFolderId, fallbackName);
  }

  const displayName = fallbackName ?? `folder-${parentFolderId}`;
  const sanitizedName = sanitizeName(displayName, parentFolderId);
  return { sanitized: [sanitizedName], display: [displayName] };
}

async function collectExistingFiles(rootDir) {
  const files = new Map();

  async function walk(currentDir) {
    let entries;
    try {
      entries = await readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        return;
      }
      throw error;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        const relativePath = path.relative(rootDir, fullPath);
        const content = await readFile(fullPath, 'utf8');
        const hash = createHash('sha256').update(content).digest('hex');
        files.set(relativePath, { hash, size: Buffer.byteLength(content) });
      }
    }
  }

  await walk(rootDir);
  return files;
}

async function readExistingLogEntries() {
  let content;
  try {
    content = await readFile(logFilePath, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [];
  } catch (jsonError) {
    try {
      trimmed
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .forEach((line) => JSON.parse(line));
      console.warn(
        `Log existente (${logFilePath}) detectado no formato antigo; um novo arquivo será gerado.`,
      );
      return [];
    } catch (jsonlError) {
      console.warn(
        `Não foi possível interpretar o log existente (${logFilePath}); ele será sobrescrito.`,
        jsonlError,
      );
      return [];
    }
  }
}

async function recordLogEntry(entry) {
  const entries = await readExistingLogEntries();
  entries.push(entry);
  await mkdir(path.dirname(logFilePath), { recursive: true });
  await writeFile(logFilePath, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
}

async function exportWorkflows() {
  const startedAt = new Date();
  const previousFiles = await collectExistingFiles(backupDir);

  const stagingDir = path.join(path.dirname(backupDir), `.n8n-backup-${startedAt.getTime()}`);
  await rm(stagingDir, { recursive: true, force: true });
  await mkdir(stagingDir, { recursive: true });

  let projects = [];
  const folderIndexCache = new Map();
  const projectMetaById = new Map();
  const projectStats = new Map();
  const filesByFolder = new Map();

  try {
    projects = await paginate('projects');
    console.log(`Projetos detectados: ${projects.length}`);
    projects.forEach((project) => {
      console.log(`- ${project.name ?? project.id ?? 'sem-nome'} (#${project.id ?? 'sem-id'})`);
      if (project?.id) {
        const sanitized = sanitizeName(project.name ?? project.id ?? 'projeto', project.id);
        projectMetaById.set(project.id, {
          id: project.id,
          name: project.name ?? project.id ?? 'projeto',
          sanitizedName: sanitized,
          type: project.type ?? null,
        });
      }
    });
  } catch (error) {
    console.warn('Não foi possível listar projetos, prosseguindo com workflows padrão.', error);
  }

  const summaries = [];

  if (Array.isArray(projects) && projects.length > 0) {
    for (const project of projects) {
      let workflows = [];
      try {
        workflows = await paginate('workflows', {
          projectId: project.id,
        });
      } catch (error) {
        console.warn(`Falha ao listar workflows do projeto ${project.id}:`, error);
        workflows = [];
      }

      summaries.push({ project, workflows });

      await ensureFolderIndex(project.id, projectMetaById.get(project.id), folderIndexCache);
    }
  }

  let defaultWorkflows = [];
  try {
    defaultWorkflows = await paginate('workflows');
  } catch (error) {
    console.warn('Falha ao listar workflows padrão:', error);
  }

  if (defaultWorkflows.length > 0) {
    summaries.push({ project: { id: 'default', name: 'default' }, workflows: defaultWorkflows });
  }

  const allWorkflows = summaries.flatMap((entry) => entry.workflows || []);

  if (allWorkflows.length === 0) {
    console.warn('Nenhum workflow encontrado.');
  }

  const detailedSummaries = summaries.map((entry) => {
    const workflows = entry.workflows || [];
    const nonArchived = workflows.filter((workflow) => workflow && workflow.isArchived !== true);
    const activeCount = workflows.filter((workflow) => workflow?.active).length;
    return {
      project: entry.project,
      nonArchived,
      total: workflows.length,
      active: activeCount,
    };
  });

  const totalNonArchived = detailedSummaries.reduce((sum, entry) => sum + entry.nonArchived.length, 0);
  const totalActive = detailedSummaries.reduce((sum, entry) => sum + entry.active, 0);

  if (totalNonArchived === 0) {
    console.warn(`Nenhum workflow disponível (não arquivado) entre ${allWorkflows.length} workflow(s) listados.`);
  }

  console.log(
    `Workflows total: ${allWorkflows.length} | não arquivados: ${totalNonArchived} | ativos: ${totalActive}`,
  );

  const seen = new Set();
  const changes = {
    new: [],
    updated: [],
    removed: [],
    unchanged: 0,
  };

  for (const entry of detailedSummaries) {
    if (!entry.nonArchived.length) continue;

    const projectIdHint = entry.project?.id ?? 'default';
    if (
      projectIdHint &&
      projectIdHint !== 'default' &&
      !projectMetaById.has(projectIdHint) &&
      entry.project
    ) {
      const fallbackName = entry.project?.name ?? projectIdHint;
      projectMetaById.set(projectIdHint, {
        id: projectIdHint,
        name: fallbackName,
        sanitizedName: sanitizeName(fallbackName, projectIdHint),
        type: entry.project?.type ?? null,
      });
    }

    const projectLabel =
      projectMetaById.get(projectIdHint)?.name ?? entry.project?.name ?? entry.project?.id ?? 'default';
    console.log(
      `Projeto ${projectLabel}: ${entry.nonArchived.length} não arquivado(s) de ${entry.total} (ativos: ${entry.active})`,
    );

    for (const workflow of entry.nonArchived) {
      if (!workflow?.id || seen.has(workflow.id)) continue;
      seen.add(workflow.id);

      const workflowDetail = await fetchJson(`workflows/${workflow.id}`);
      const sanitized = stripKeys(workflowDetail);
      const ownerShare =
        Array.isArray(workflowDetail?.shared) && workflowDetail.shared.length > 0
          ? workflowDetail.shared.find((share) => share?.role === 'workflow:owner') ??
            workflowDetail.shared[0]
          : undefined;

      let effectiveProjectId =
        workflow.projectId ??
        workflow.homeProjectId ??
        workflow.homeProject?.id ??
        entry.project?.id ??
        ownerShare?.projectId ??
        'default';

      if (!effectiveProjectId || typeof effectiveProjectId !== 'string') {
        effectiveProjectId = 'default';
      }

      if (!projectMetaById.has(effectiveProjectId)) {
        const inferredName =
          ownerShare?.project?.name ??
          ownerShare?.projectName ??
          workflow.project?.name ??
          entry.project?.name ??
          effectiveProjectId;
        projectMetaById.set(effectiveProjectId, {
          id: effectiveProjectId,
          name: inferredName,
          sanitizedName: sanitizeName(inferredName, effectiveProjectId),
          type: ownerShare?.project?.type ?? workflow.project?.type ?? entry.project?.type ?? null,
        });
      }

      const projectMeta =
        projectMetaById.get(effectiveProjectId) ??
        projectMetaById.get(projectIdHint) ?? {
          id: effectiveProjectId,
          name: effectiveProjectId,
          sanitizedName: sanitizeName(effectiveProjectId, effectiveProjectId),
          type: null,
        };

      const folderIndex = await ensureFolderIndex(
        effectiveProjectId,
        projectMeta,
        folderIndexCache,
      );

      const parentFolderId =
        workflow.parentFolderId ??
        workflow.parentFolder?.id ??
        workflowDetail?.parentFolderId ??
        workflowDetail?.parentFolder?.id ??
        null;

      const parentFolderName =
        workflow.parentFolder?.name ?? workflowDetail?.parentFolder?.name ?? ownerShare?.folder?.name;

      const folderPlacement = resolveFolderPlacement(folderIndex, parentFolderId, parentFolderName);
      const workflowDir = stagingDir;
      await mkdir(workflowDir, { recursive: true });
      const baseSafeName = sanitizeName(
        workflow.name || `workflow-${workflow.id}`,
        `workflow-${workflow.id}`,
      );
      let filePath = path.join(workflowDir, `${baseSafeName}.json`);

      if (await fileExists(filePath)) {
        const suffix = workflow.id ? `-${workflow.id}` : `-${Date.now()}`;
        filePath = path.join(workflowDir, `${baseSafeName}${suffix}.json`);
      }

      const serialized = `${JSON.stringify(sanitized, null, 2)}\n`;
      await writeFile(filePath, serialized, 'utf8');

      const folderKey = '.';
      const fileList = filesByFolder.get(folderKey) ?? [];
      fileList.push(path.basename(filePath));
      filesByFolder.set(folderKey, fileList);

      const relativePath = path.relative(stagingDir, filePath);
      const contentHash = createHash('sha256').update(serialized).digest('hex');
      const previous = previousFiles.get(relativePath);

      let changeType = 'new';
      if (previous) {
        if (previous.hash === contentHash) {
          changeType = 'unchanged';
          changes.unchanged += 1;
        } else {
          changeType = 'updated';
          changes.updated.push({
            id: workflow.id,
            name: workflow.name ?? `workflow-${workflow.id}`,
            path: relativePath,
            projectId: effectiveProjectId,
          });
        }
        previousFiles.delete(relativePath);
      } else {
        changes.new.push({
          id: workflow.id,
          name: workflow.name ?? `workflow-${workflow.id}`,
          path: relativePath,
          projectId: effectiveProjectId,
        });
      }

      const badges = {
        new: 'novo',
        updated: 'atualizado',
        unchanged: 'inalterado',
      };
      const badge = badges[changeType] ?? 'processado';
      console.log(
        `✓ ${projectMeta.name}: ${workflow.name ?? 'Sem nome'} (#${workflow.id}) — ${badge} (${relativePath})`,
      );

      const statsKey = projectMeta.id ?? effectiveProjectId;
      const stats =
        projectStats.get(statsKey) ?? {
          projectId: statsKey,
          projectName: projectMeta.name,
          nonArchived: 0,
          active: 0,
          folderCount:
            folderIndex && typeof folderIndex?.count === 'number' ? folderIndex.count : undefined,
        };
      stats.projectName = projectMeta.name;
      stats.nonArchived += 1;
      if (workflow.active) {
        stats.active += 1;
      }
      if (
        (stats.folderCount === undefined || stats.folderCount === null) &&
        folderIndex &&
        typeof folderIndex?.count === 'number'
      ) {
        stats.folderCount = folderIndex.count;
      }
      projectStats.set(statsKey, stats);
    }
  }

  const finishedAt = new Date();
  const foldersLog = Array.from(filesByFolder.entries())
    .map(([folderPath, arquivos]) => ({
      pasta: folderPath,
      arquivos: [...arquivos].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.pasta.localeCompare(b.pasta));

  if (seen.size === 0) {
    await rm(stagingDir, { recursive: true, force: true });
    console.warn('Nenhum workflow exportado; mantendo backup anterior.');
    return {
      status: 'empty',
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      backupDir,
      totals: {
        projects: 0,
        workflows: { listed: allWorkflows.length, nonArchived: 0, active: 0 },
      },
      changes,
      projects: [],
      logEntry: {
        dataBackup: finishedAt.toISOString(),
        pastas: [],
        observacao: 'Nenhum workflow exportado; verifique token/permissões do n8n.',
      },
    };
  }

  const removedEntries = Array.from(previousFiles.keys());
  removedEntries.forEach((relativePath) => {
    changes.removed.push({ path: relativePath });
  });

  console.log(
    `Resumo: novos=${changes.new.length} | atualizados=${changes.updated.length} | ` +
      `inalterados=${changes.unchanged} | removidos=${changes.removed.length}`,
  );

  await rm(backupDir, { recursive: true, force: true });
  await mkdir(path.dirname(backupDir), { recursive: true });
  await rename(stagingDir, backupDir);

  console.log(`Backup concluído. ${seen.size} workflow(s) não arquivados salvos em ${backupDir}`);

  const projectSummaries = Array.from(projectStats.values()).map((stats) => ({
    projectId: stats.projectId,
    projectName: stats.projectName,
    nonArchived: stats.nonArchived,
    active: stats.active,
    folders: stats.folderCount ?? null,
  }));

  const logEntry = {
    dataBackup: finishedAt.toISOString(),
    pastas: foldersLog,
  };

  return {
    status: 'success',
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    backupDir,
    totals: {
      projects: projectSummaries.length,
      workflows: {
        listed: allWorkflows.length,
        nonArchived: totalNonArchived,
        active: totalActive,
      },
    },
    changes,
    projects: projectSummaries,
    logEntry,
  };
}

exportWorkflows()
  .then(async (result) => {
    if (result?.logEntry) {
      await recordLogEntry(result.logEntry);
      console.log(`Log registrado em ${logFilePath}`);
    }
  })
  .catch(async (err) => {
    console.error('Falha ao exportar workflows:', err);
    const errorEntry = {
      dataBackup: new Date().toISOString(),
      erro: err instanceof Error ? err.message : String(err),
    };
    await recordLogEntry(errorEntry);
    process.exit(1);
  });
