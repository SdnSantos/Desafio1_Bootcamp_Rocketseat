const express = require("express");

const server = express();

server.use(express.json());

const projects = [
  {
    id: "1",
    title: "Novo Projeto",
    tasks: []
  },
  {
    id: "2",
    title: "Novo Projeto 2",
    tasks: []
  },
  {
    id: "3",
    title: "Novo Projeto 3",
    tasks: []
  }
];

let contReq = 0;

// verificar quantidade de requisições
function checkLogRequest(req, res, next) {
  contReq++;
  console.log(`Essa é a requisição de nº ${contReq}`);

  return next();
}

// verificar existência do projeto
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);

  if (index == "-1") {
    return res.status(400).json({ error: "Project not exists" });
  }

  return next();
}

// listar projetos
server.get("/projects", checkLogRequest, (req, res) => {
  return res.json(projects);
});

// listar projeto
server.get("/projects/:id", checkProjectExists, checkLogRequest, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);

  return res.json(projects[index]);
});

// criar projeto
server.post("/projects/", checkLogRequest, (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(projects);
});

// criar tarefa
server.post(
  "/projects/:id/tasks",
  checkProjectExists,
  checkLogRequest,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    let project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);
  }
);

// editar projeto
server.put("/projects/:id", checkProjectExists, checkLogRequest, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  let project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

// deletar projeto
server.delete(
  "/projects/:id",
  checkProjectExists,
  checkLogRequest,
  (req, res) => {
    const { id } = req.params;

    let project = projects.findIndex(p => p.id == id);

    projects.splice(project, 1);

    return res.send();
  }
);

// redirecionando para porta
server.listen(3000);
