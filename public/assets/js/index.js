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