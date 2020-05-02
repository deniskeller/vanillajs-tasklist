// Main js file
const textarea = document.querySelector('#textarea');
const addCard = document.querySelector('#add-card');
const overflow = document.querySelector('.task-form__text-overflow');



addCard.addEventListener('click', () => {
  // console.log(textarea.value);

  const todo = {
    text: textarea.value.trim(),
    date: new Date().toJSON()
  }
  if (textarea.value == '') {
    overflow.classList.add("error")
  }


  console.log('Todo', todo);
  textarea.value = ''

})
textarea.addEventListener('keyup', () => {
  if (textarea.value !== '') {
    overflow.classList.remove("error")
  }

})
