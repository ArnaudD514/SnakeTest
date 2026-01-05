const projects = [
  {
    name: 'Channel Design Project',
    credits: 20,
    attributes: ['Design', 'Brand'],
    user: 'Arnaud',
    updated: 'Today',
  },
  {
    name: 'Material Library',
    credits: 12,
    attributes: ['Research', 'Material'],
    user: 'Isha',
    updated: 'Yesterday',
  },
  {
    name: 'Onboarding Flows',
    credits: 8,
    attributes: ['Product', 'UX'],
    user: 'Arnaud',
    updated: '2 days ago',
  },
  {
    name: 'Sales Dashboard',
    credits: 15,
    attributes: ['Analytics', 'Growth'],
    user: 'Priya',
    updated: '1 week ago',
  },
  {
    name: 'Mobile Patterns',
    credits: 10,
    attributes: ['Design', 'Mobile'],
    user: 'Luca',
    updated: '3 days ago',
  },
];

const searchInput = document.getElementById('searchInput');
const attributeFilter = document.getElementById('attributeFilter');
const userFilter = document.getElementById('userFilter');
const projectList = document.getElementById('projectList');
const creditAmount = document.getElementById('creditAmount');
const activeProjectCredits = document.getElementById('activeProjectCredits');

function hydrateFilters() {
  const attributeSet = new Set();
  const userSet = new Set();

  projects.forEach((project) => {
    project.attributes.forEach((attr) => attributeSet.add(attr));
    userSet.add(project.user);
  });

  attributeSet.forEach((attr) => {
    const option = document.createElement('option');
    option.value = attr;
    option.textContent = attr;
    attributeFilter.appendChild(option);
  });

  userSet.forEach((user) => {
    const option = document.createElement('option');
    option.value = user;
    option.textContent = user;
    userFilter.appendChild(option);
  });
}

function renderProjects(filteredProjects = projects) {
  projectList.innerHTML = '';

  if (filteredProjects.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'project-card';
    empty.textContent = 'No projects match the current filters.';
    projectList.appendChild(empty);
    return;
  }

  filteredProjects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';

    const header = document.createElement('div');
    header.className = 'project-header';

    const name = document.createElement('h2');
    name.className = 'project-name';
    name.textContent = project.name;

    const badge = document.createElement('span');
    badge.className = 'badge';
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = project.name.charAt(0);
    const credits = document.createElement('span');
    credits.textContent = `${project.credits} credits`;
    badge.append(tag, credits);

    header.append(name, badge);

    const meta = document.createElement('div');
    meta.className = 'project-meta';
    project.attributes.forEach((attr) => {
      const chip = document.createElement('span');
      chip.className = 'badge';
      chip.textContent = attr;
      meta.appendChild(chip);
    });

    const footer = document.createElement('div');
    footer.className = 'project-footer';

    const userChip = document.createElement('span');
    userChip.className = 'user-chip';
    userChip.textContent = project.user;

    const updated = document.createElement('span');
    updated.textContent = `Updated ${project.updated}`;

    footer.append(userChip, updated);

    card.append(header, meta, footer);
    projectList.appendChild(card);
  });
}

function filterProjects() {
  const query = searchInput.value.toLowerCase().trim();
  const attribute = attributeFilter.value;
  const user = userFilter.value;

  const filtered = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(query);
    const matchesAttribute = attribute === 'all' || project.attributes.includes(attribute);
    const matchesUser = user === 'all' || project.user === user;
    return matchesSearch && matchesAttribute && matchesUser;
  });

  renderProjects(filtered);
}

function initCredits() {
  const totalCredits = projects.reduce((sum, project) => sum + project.credits, 0);
  creditAmount.textContent = totalCredits;

  const active = projects.find((project) => project.name === 'Channel Design Project');
  if (active) {
    activeProjectCredits.textContent = `${active.credits} Credits`;
  }
}

function init() {
  hydrateFilters();
  renderProjects();
  initCredits();

  searchInput.addEventListener('input', filterProjects);
  attributeFilter.addEventListener('change', filterProjects);
  userFilter.addEventListener('change', filterProjects);
}

window.addEventListener('DOMContentLoaded', init);
