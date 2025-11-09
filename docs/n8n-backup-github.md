Objetivo
- Fazer backup horário dos workflows do n8n Cloud direto no GitHub, sem baixar local.
- Gravar sempre nos mesmos paths: `backups/<Pasta>/<WorkflowName>.json`.
- Deixar o Git mostrar diffs entre execuções (sem snapshots por data).

Entradas/Saídas
- Entrada: REST do n8n Cloud (`/rest/folders`, `/rest/workflows`, `/rest/workflows/:id`).
- Saída: arquivos JSON no repo GitHub em `backups/<Pasta>/<WorkflowName>.json`.
- Log (opcional): atualizar `backups/n8n-backup.log.jsonl` após todos os commits.

Credenciais necessárias
- `HTTP Request` → `X-N8N-API-KEY` (crie um API Key na UI do n8n Cloud).
- `GitHub` → PAT com escopo `repo`, apontando para `owner/repo` e `branch` (ex.: `main`).

Agendamento
- Nó `Cron`: Every hour → minuto sugerido `05`.
- Expressão CRON equivalente: `0 5 * * * *` (segundos, minutos, horas...).

Blueprint do Workflow (nós)
1) `Cron`
- Config: Every hour, minute `05`.

2) `Set` (Constantes)
- Campos JSON:
  - `BASE_URL`: `https://<seu-workspace>.n8n.cloud/rest`
  - `OWNER`: `aldosantos` (exemplo)
  - `REPO`: `MindQuest` (exemplo)
  - `BRANCH`: `main`

3) `HTTP Request` — Listar Folders
- Método: `GET`
- URL: `={{ $json.BASE_URL + '/folders' }}` (conecte a partir do `Set`)
- Headers: `X-N8N-API-KEY: <seu_token>` (credencial ou header direto)

4) `HTTP Request` — Listar Workflows
- Método: `GET`
- URL: `={{ $json.BASE_URL + '/workflows' }}`
- Headers: `X-N8N-API-KEY: <seu_token>`

5) `Function` — Juntar folders e preparar items
```js
// Inputs: 'Listar Folders'.json.data, 'Listar Workflows'.json.data
// Conecte ambos em paralelo e use este node ligado a 'Listar Workflows'
// e leia folders via $node["Listar Folders"].json.data
const folders = ($node['HTTP Request - Listar Folders'].json.data || []).reduce((acc, f) => {
  acc[f.id] = f.name;
  return acc;
}, {});

const sanitize = (s) => (s || 'Uncategorized').replace(/[\\/\\:?*"<>|]/g, '_');

const out = [];
for (const wf of ($json.data || [])) {
  const folderName = folders[wf.folderId] || 'Uncategorized';
  out.push({
    id: wf.id,
    name: wf.name,
    folderName,
    folderSlug: sanitize(folderName),
    workflowSlug: sanitize(wf.name),
  });
}
return out.map(x => ({ json: x }));
```

6) `Split In Batches` — Iterar workflows
- Tamanho do lote: `1`.

7) `HTTP Request` — Obter Workflow (completo)
- Método: `GET`
- URL: `={{ $json.BASE_URL + '/workflows/' + $json.id }}` (puxe `BASE_URL` via conexão do `Set` ou `$item(0).$node['Set'].json.BASE_URL`)
- Headers: `X-N8N-API-KEY: <seu_token>`

8) `Function` — Preparar conteúdo e path
```js
// Entrada: JSON do GET workflow (objeto do n8n)
// Saída: json com { path, content }
const folder = $item(0).$node['Function — Juntar folders e preparar items'].json.folderSlug;
const file = $item(0).$node['Function — Juntar folders e preparar items'].json.workflowSlug + '.json';
const path = `backups/${folder}/${file}`;
return [{ json: { path, content: JSON.stringify($json, null, 2) } }];
```

9) `GitHub` — Get File (verificar existência)
- Resource: `File`
- Operation: `Get`
- Owner: `={{ $item(0).$node['Set'].json.OWNER }}`
- Repository: `={{ $item(0).$node['Set'].json.REPO }}`
- File Path: `={{ $json.path }}`
- Branch: `={{ $item(0).$node['Set'].json.BRANCH }}`
- Marcar `Continue On Fail` (para 404 não quebrar o fluxo).

10) `IF` — Arquivo existe?
- Condição: `={{ $node['GitHub — Get File'].json.sha != null }}`
- True → vai para `GitHub — Edit`
- False → vai para `GitHub — Create`

11) `GitHub` — Create File
- Resource: `File`, Operation: `Create`
- Owner/Repo/Branch: conforme acima
- File Path: `={{ $node['Function — Preparar conteúdo e path'].json.path }}`
- File Content: `={{ $node['Function — Preparar conteúdo e path'].json.content }}`
- Commit Message: `={{ 'backup(n8n): add ' + $json.path }}`

12) `GitHub` — Edit File
- Resource: `File`, Operation: `Edit`
- Owner/Repo/Branch: conforme acima
- File Path: `={{ $node['Function — Preparar conteúdo e path'].json.path }}`
- File Content: `={{ $node['Function — Preparar conteúdo e path'].json.content }}`
- SHA: `={{ $node['GitHub — Get File'].json.sha }}`
- Commit Message: `={{ 'backup(n8n): update ' + $json.path }}`

13) `Split In Batches` — Próximo lote
- Conectar saída de `Create` e `Edit` de volta ao `Split In Batches` e acionar `Continue` até processar todos.

14) (Opcional) Log agregado em `backups/n8n-backup.log.jsonl`
- Requer acumular a lista final por pasta (ex.: usando `Item Lists` + `Function` ao fim do loop para agrupar) e então:
  - `GitHub — Get File` (para obter o array atual do log),
  - `Function` (append do novo objeto `{ dataBackup, pastas: [...] }`),
  - `GitHub — Edit File` (commit do log atualizado).
- Observação: o arquivo atual está num formato de array JSON único, não JSONL linha‑a‑linha. Mantenha o mesmo padrão.

Conexões sugeridas
- `Cron` → `Set` → `HTTP Request — Listar Folders`.
- `Set` → `HTTP Request — Listar Workflows`.
- `HTTP Request — Listar Workflows` + `HTTP Request — Listar Folders` → `Function — Juntar...`.
- `Function — Juntar...` → `Split In Batches` → `HTTP Request — Obter Workflow` → `Function — Preparar conteúdo...` → `GitHub — Get File` → `IF` → (`Create` | `Edit`) → de volta ao `Split In Batches` (Continue) até acabar.

Validação
- Após montar, use `Executar` no n8n com 1–2 workflows para validar paths/commits.
- Revisar no GitHub se `backups/<Pasta>/<WorkflowName>.json` está sendo sobrescrito corretamente.

Notas
- Renomeios de workflow/pasta alteram o path; se quiser estabilidade máxima, troque o nome de arquivo para `workflowId.json` e mantenha um `backups/index.json` mapeando `id → nome`.
- Para reduzir commits, você pode comparar conteúdo (ex.: `HTTP Request` para `Get Raw` do arquivo no GitHub) e só comitar se houver diferença.

