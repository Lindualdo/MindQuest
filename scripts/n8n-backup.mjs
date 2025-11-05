import { mkdir, writeFile, rm, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const apiRoot = new URL('https://mindquest-n8n.cloudfy.live/api/v1/');
const apiKey = process.env.N8N_API_KEY;

if (!apiKey) {
  console.error('Defina a variável N8N_API_KEY antes de rodar.');
  process.exit(1);
}

const backupDir = path.resolve('backups/n8n');
const pageLimit = Number(process.env.N8N_PAGE_LIMIT ?? '100');
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

  do {
    const params = { ...baseParams, limit: String(pageLimit) };
    if (cursor) {
      params.cursor = cursor;
    }

    const page = await fetchJson(resourcePath, params);
    const pageItems = Array.isArray(page?.data) ? page.data : [];
    items.push(...pageItems);
    cursor =
      typeof page?.nextCursor === 'string' && page.nextCursor.length > 0 ? page.nextCursor : undefined;
  } while (cursor);

  return items;
}

function sanitizeName(value, fallback) {
  const raw = (value ?? fallback ?? 'default').toString();
  const normalized = raw.normalize('NFKD').replace(/[^a-z0-9-_]+/gi, '_');
  const trimmed = normalized.replace(/^_+|_+$/g, '');
  return trimmed.length > 0 ? trimmed : fallback ?? 'default';
}

async function exportWorkflows() {
  await rm(backupDir, { recursive: true, force: true });
  await mkdir(backupDir, { recursive: true });

  let projects = [];
  try {
    projects = await paginate('projects');
    console.log(`Projetos detectados: ${projects.length}`);
    projects.forEach((project) => {
      console.log(`- ${project.name ?? project.id ?? 'sem-nome'} (#${project.id ?? 'sem-id'})`);
    });
  } catch (error) {
    console.warn('Não foi possível listar projetos, prosseguindo com workflows padrão.', error);
  }

  const summaries = [];

  const defaultWorkflows = await paginate('workflows');

  if (defaultWorkflows.length > 0) {
    summaries.push({ project: { id: 'default', name: 'default' }, workflows: defaultWorkflows });
  }

  if (Array.isArray(projects) && projects.length > 0) {
    for (const project of projects) {
      const workflows = await paginate('workflows', { projectId: project.id });
      summaries.push({ project, workflows });
    }
  }

  const allWorkflows = summaries.flatMap((entry) => entry.workflows || []);

  if (allWorkflows.length === 0) {
    console.warn('Nenhum workflow encontrado.');
    return;
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
    return;
  }

  console.log(
    `Workflows total: ${allWorkflows.length} | não arquivados: ${totalNonArchived} | ativos: ${totalActive}`,
  );

  const seen = new Set();

  for (const entry of detailedSummaries) {
    if (!entry.nonArchived.length) continue;

    const projectLabel = entry.project?.name || entry.project?.id || 'default';
    const projectName = sanitizeName(projectLabel, entry.project?.id);
    const projectDir = path.join(backupDir, projectName);
    await mkdir(projectDir, { recursive: true });

    console.log(
      `Projeto ${projectLabel}: ${entry.nonArchived.length} não arquivado(s) de ${entry.total} (ativos: ${entry.active})`,
    );

    for (const workflow of entry.nonArchived) {
      if (!workflow?.id || seen.has(workflow.id)) continue;
      seen.add(workflow.id);

      const data = await fetchJson(`workflows/${workflow.id}`);
      const sanitized = stripKeys(data);
      const baseSafeName = sanitizeName(workflow.name || `workflow-${workflow.id}`, `workflow-${workflow.id}`);
      let filePath = path.join(projectDir, `${baseSafeName}.json`);

      if (await fileExists(filePath)) {
        const suffix = workflow.id ? `-${workflow.id}` : `-${Date.now()}`;
        filePath = path.join(projectDir, `${baseSafeName}${suffix}.json`);
      }

      await writeFile(filePath, `${JSON.stringify(sanitized, null, 2)}\n`, 'utf8');
      console.log(`✓ ${projectName}: ${workflow.name ?? 'Sem nome'} (#${workflow.id})`);
    }
  }

  console.log(`Backup concluído. ${seen.size} workflow(s) não arquivados salvos em ${backupDir}`);
}

exportWorkflows().catch((err) => {
  console.error('Falha ao exportar workflows:', err);
  process.exit(1);
});
