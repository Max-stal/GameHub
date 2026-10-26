
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Элементы полей
    const lastName = document.getElementById('lastName');
    const firstName = document.getElementById('firstName');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const genres = document.getElementsByName('genre');

    // Регулярные выражения
    const nameRegex = /^[А-ЯЁа-яёA-Za-z\s\-]{2,50}$/;
    const phoneRegex = /^(\+?996|0)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let isValid = true;

    // Валидация Фамилии
    if (!nameRegex.test(lastName.value.trim())) {
        showError('lastName', 'lastNameError');
        isValid = false;
    } else {
        hideError('lastName', 'lastNameError');
    }

    // Валидация Имени
    if (!nameRegex.test(firstName.value.trim())) {
        showError('firstName', 'firstNameError');
        isValid = false;
    } else {
        hideError('firstName', 'firstNameError');
    }

    // Валидация Телефона
    if (!phoneRegex.test(phone.value.trim())) {
        showError('phone', 'phoneError');
        isValid = false;
    } else {
        hideError('phone', 'phoneError');
    }

    // Валидация Email
    if (!emailRegex.test(email.value.trim())) {
        showError('email', 'emailError');
        isValid = false;
    } else {
        hideError('email', 'emailError');
    }

    // Валидация Выбора жанра
    let genreSelected = false;
    for (const radio of genres) {
        if (radio.checked) {
            genreSelected = true;
            break;
        }
    }

    if (!genreSelected) {
        document.getElementById('genreError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('genreError').style.display = 'none';
    }

    // Успешная отправка
    if (isValid) {
        document.getElementById('successMessage').style.display = 'block';
        console.log("Данные формы валидны!");
    } else {
        document.getElementById('successMessage').style.display = 'none';
    }
});

function showError(inputId, errorId) {
    document.getElementById(inputId).classList.add('error');
    document.getElementById(errorId).style.display = 'block';
}

function hideError(inputId, errorId) {
    document.getElementById(inputId).classList.remove('error');
    document.getElementById(errorId).style.display = 'none';
}
