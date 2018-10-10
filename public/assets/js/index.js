document.addEventListener('DOMContentLoaded', function() {
  getBook();
});

function getBook() {
  fetch('/api/book/maths')
    .then(response => response.json())
    .then(data  => {
      const unsortedSections = data.response.slice();
      const sections = unsortedSections &&
        unsortedSections.sort((a,b) => {
          return a.sequenceNO - b.sequenceNO;
        })
      console.log(sections);
      buildSections(sections);
    })
}

function buildSections(sections) {
  const ulNode = document.createElement('ul');
  sections.map(section => {
    const liNode = document.createElement('li');
    liNode.textContent = section.title;
    liNode.onclick = function() {
      toggleSection(this, section.id);
    };
    ulNode.appendChild(liNode);
  });
  const containerNode = document.getElementsByClassName('container')[0];
  hideLoader();
  containerNode.appendChild(ulNode);
}

function hideLoader() {
  const loaderNode = document.getElementsByClassName('loader')[0];
  loaderNode.hidden = true;
}

function toggleSection(element, sectionId) {
  const isOpen = element.getAttribute('data-open');
  if (isOpen === 'true') {
    const ulChildNode = element.querySelector('ul');
    ulChildNode.hidden = true;
    element.setAttribute('data-open', 'false');
  } else {
    const ulChildNode = element.querySelector('ul');
    if (ulChildNode) {
      ulChildNode.hidden = false;
      element.setAttribute('data-open', 'true');
    } else {
      const ulNode = document.createElement('ul');
      getSection(sectionId)
        .then((chapters) => {
          chapters.map(chapter => {
            const liNode = document.createElement('li');
            liNode.textContent = chapter.title;
            ulNode.appendChild(liNode);
          });
        });
      element.appendChild(ulNode);
      element.setAttribute('data-open', 'true');
    }
  }
}

function getSection(sectionId) {
  return fetch(`/api/book/maths/section/${sectionId}`)
    .then(response => response.json())
    .then(data  => {
      const unsortedChapters = data.response[sectionId].slice();
      const chapters = unsortedChapters &&
        unsortedChapters.sort((a,b) => {
          return a.sequenceNO - b.sequenceNO;
        })
      console.log(chapters);
      return chapters;
    })
}