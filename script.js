const dropzone = document.querySelector('#dropzone');
const fileInput = document.querySelector('#file-input');
const preview = document.querySelector('#preview');
const fileStatus = document.querySelector('#file-status');
const demoButton = document.querySelector('#demo-button');
const toast = document.querySelector('#toast');

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
}

function showFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Пожалуйста, выберите изображение в формате PNG, JPG или WEBP.');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showToast('Файл слишком большой. Максимальный размер — 10 МБ.');
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    preview.style.backgroundImage = `url("${reader.result}")`;
    dropzone.classList.add('has-preview');
    fileStatus.textContent = `${file.name} · фото загружено`;
    showToast('Фото добавлено. В этой демо-версии следующий шаг пока имитируется.');
  });
  reader.readAsDataURL(file);
}

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    fileInput.click();
  }
});
fileInput.addEventListener('change', (event) => showFile(event.target.files[0]));

['dragenter', 'dragover'].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add('is-dragging');
  });
});
['dragleave', 'drop'].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove('is-dragging');
  });
});
dropzone.addEventListener('drop', (event) => showFile(event.dataTransfer.files[0]));
demoButton.addEventListener('click', () => showToast(fileInput.files[0] ? 'Отлично. В следующей версии здесь появится выбор стиля и оформление заказа.' : 'Сначала добавьте фотографию — это займёт всего несколько секунд.'));
