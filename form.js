const btnGameStart = document.querySelector(".game-form");

const getFormData = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  console.log(formData);
};
btnGameStart.addEventListener("submit", getFormData);
