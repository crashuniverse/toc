document.addEventListener('DOMContentLoaded', function() {
  getBook()
  .then(sections => buildSections(sections))
  .catch(error => console.log(error));
});

function getBook() {
  return fetch('/api/book/maths')
    .then(response => {
      console.log(response);
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data  => {
      const unsortedSections = data && data.response && data.response.slice();
      const sections = unsortedSections &&
        unsortedSections.sort((a,b) => {
          return a.sequenceNO - b.sequenceNO;
        })
      console.log(sections);
      return sections;
    })
    .catch(error => console.log(error));
}

function buildSections(sections) {
  const ulNode = document.createElement('ul');
  ulNode.className = 'book';
  sections.map(section => {
    const liNode = document.createElement('li');
    liNode.className = 'section';
    const titleNode = document.createElement('div');
    titleNode.textContent = section.title;
    titleNode.className = 'section-title';
    titleNode.onclick = function() {
      toggleSection(this.parentElement, section.id);
    };
    liNode.appendChild(titleNode);
    ulNode.appendChild(liNode);
  });
  const containerNode = document.getElementsByClassName('container')[0];
  hideBookLoader();
  containerNode.appendChild(ulNode);
}

function hideBookLoader() {
  const loaderNode = document.getElementsByClassName('loader-book')[0];
  loaderNode.remove();
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
      ulNode.className = 'contents';
      const loader = document.createElement('div');
      loader.textContent = 'Loading chapters and lessons';
      loader.className = 'loader-section';
      ulNode.appendChild(loader);
      getSection(sectionId)
        .then((chapters) => {
          chapters.map(chapter => {
            const liNode = document.createElement('li');
            liNode.textContent = chapter.title;
            liNode.className = 'chapter';
            ulNode.appendChild(liNode);
          });
          hideSectionLoader();
        })
        .catch(error => {
          console.log(error);
          hideSectionLoader();
        });
      element.appendChild(ulNode);
      element.setAttribute('data-open', 'true');
    }
  }
}

function hideSectionLoader() {
  const loaderNode = document.getElementsByClassName('loader-section')[0];
  loaderNode.remove();
}

function getSection(sectionId) {
  return fetch(`/api/book/maths/section/${sectionId}`)
    .then(response => response.json())
    .then(data  => {
      const unsortedChapters = data && data.response && data.response[sectionId]
        && data.response[sectionId].slice();
      const chapters = unsortedChapters &&
        unsortedChapters.sort((a,b) => {
          return a.sequenceNO - b.sequenceNO;
        })
      console.log(chapters);
      return chapters;
    })
    .catch(error => console.log(error));
}