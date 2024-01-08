// Importa las funciones necesarias desde los SDK que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Configuración de tu aplicación Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD7ZFxfXta4Nh8F3sr94PP9BRaTXEJIWiw",
  authDomain: "pruebaconectiondb.firebaseapp.com",
  databaseURL: "https://pruebaconectiondb-default-rtdb.firebaseio.com",
  projectId: "pruebaconectiondb",
  storageBucket: "pruebaconectiondb.appspot.com",
  messagingSenderId: "836147307503",
  appId: "1:836147307503:web:b43799aaa1d68237d3cc1a"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
  // Constantes para selecciones DOM
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const eyeIcons = document.querySelectorAll(".eye-icon");
  const registerForm = document.querySelector("form");
  const usernameInput = document.getElementById("username");
  const passwordField = document.getElementById("password");
  const confirmPasswordField = document.getElementById("confirm-password");
  const emailField = document.getElementById("email");
  const phoneField = document.getElementById("phone");

  // Configuración de eventos
  eyeIcons.forEach(function (eyeIcon) {
    eyeIcon.addEventListener("click", function () {
      togglePasswordVisibility(this);
    });
  });

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío del formulario

    if (!validateForm()) {
      return;
    }

    const email = emailField.value;
    const password = passwordField.value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const bioDefault = "Escribe aqui tu descripccion biografica";

    // Validar que el campo de teléfono solo contiene números
    if (!isValidPhoneNumber(phone)) {
      alert("Por favor, ingresa un número de teléfono válido (solo números).");
      return;
    }

    // Crea un objeto con los datos del usuario
    const fechaCreacion = new Date().toISOString(); // Obtén la fecha actual en formato ISO
    const nuevoUsuario = {
      nombre: firstname,
      apellido: lastname,
      correo: email,
      usuario: username,
      telefono: phone,
      password: password,
      fechaCreacion: fechaCreacion,
      bioDescription: bioDefault,
      // Otros campos que desees almacenar
    };

    // Crea usuario en Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Usuario registrado con éxito
        const user = userCredential.user;
        console.log("Usuario registrado:", user);

        // Obtiene una referencia a la base de datos
        const db = getDatabase(app);

        // Establece los datos del nuevo usuario en la base de datos
        set(ref(db, 'usuarios/' + user.uid), nuevoUsuario);
        // Crea el nodo "Posts" para el usuario recién registrado (sin datos específicos)
        set(ref(db, 'posts/' + user.uid), {});

        // Crea el nodo "AccountStatistics" para el usuario recién registrado
        const accountStatisticsNode = ref(db, 'accountStatistics/' + user.uid);
        const initialStatisticsData = {
          followersCount: 0,
          followingCount: 0,
          profileLikesCount: 0,
          totalPostsCount: 0,
          totalStoriesCount: 0,
          activityHoursCount: 0
        };
        set(accountStatisticsNode, initialStatisticsData);

        // Crea el nodo "Followers" para las personas que te siguen
        const followersNode = ref(db, 'followers/' + user.uid);
        set(followersNode, {});

        // Crea el nodo "Following" para las personas que sigues
        const followingNode = ref(db, 'following/' + user.uid);
        set(followingNode, {});

        // Obtiene una referencia al servicio de almacenamiento de Firebase
        const storage = getStorage(app);
        const defaultImageRef = storageRef(storage, 'default/icon-user.png'); // Asegúrate de ajustar la ruta correcta
        const defaultImageCover = storageRef(storage, 'default/cover-user.jpg'); // Asegúrate de ajustar la ruta correcta

        // Obtiene la URL de descarga de la imagen por defecto
        getDownloadURL(defaultImageRef)
          .then((downloadURL) => {
            // Asigna la URL de descarga al usuario recién registrado
            set(ref(db, `usuarios/${user.uid}/imagenPerfil`), downloadURL);

            // Obtiene la URL de descarga de la imagen de portada por defecto
            getDownloadURL(defaultImageCover)
              .then((coverDownloadURL) => {
                // Asigna la URL de descarga de la imagen de portada al usuario recién registrado
                set(ref(db, `usuarios/${user.uid}/imagenPortada`), coverDownloadURL);

                showSuccessModal();
              })
              .catch((coverError) => {
                console.error("Error al obtener la URL de descarga de la imagen de portada:", coverError);
                showServerErrorModal();
              });
          })
          .catch((profileError) => {
            console.error("Error al obtener la URL de descarga de la imagen de perfil:", profileError);
            showServerErrorModal();
          });
      })
      .catch(handleRegistrationError);
  });

  // Funciones de utilidad
  function togglePasswordVisibility(eyeIcon) {
    const associatedInput = eyeIcon.parentElement.querySelector("input");

    if (associatedInput.type === "password") {
      associatedInput.type = "text";
      eyeIcon.innerHTML = '<i class="fa fa-eye-slash"></i>';
    } else {
      associatedInput.type = "password";
      eyeIcon.innerHTML = '<i class="fa fa-eye"></i>';
    }
  }

  function handleRegistrationSuccess(userCredential) {
    // Usuario registrado con éxito
    const user = userCredential.user;
    console.log("Usuario registrado:", user);

    showSuccessModal();
  }

  function handleRegistrationError(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(`Error al registrar usuario: ${errorCode} - ${errorMessage}`);

    // Verifica si el error es debido a que el correo ya está registrado
    if (errorCode === 'auth/email-already-in-use') {
      showUserExistsModal();
    } else {
      showServerErrorModal();
    }
  }

  function showSuccessModal() {
    const successModal = document.getElementById("successModal");
    successModal.style.display = "block";

    setTimeout(function () {
      closeSuccessModal();
    }, 3000);
  }

  function closeSuccessModal() {
    const successModal = document.getElementById("successModal");
    successModal.classList.add("hide");

    setTimeout(function () {
      successModal.style.display = "none";
      successModal.classList.remove("hide");
    }, 500); // Este valor debe coincidir con la duración de la animación (0.5s en este caso)
  }

  function showUserExistsModal() {
    const userExistsModal = document.getElementById("userExistsModal");
    userExistsModal.style.display = "block";

    setTimeout(function () {
      closeUserExistsModal();
    }, 3000);
  }

  function closeUserExistsModal() {
    const userExistsModal = document.getElementById("userExistsModal");
    userExistsModal.classList.add("hide");

    setTimeout(function () {
      userExistsModal.style.display = "none";
      userExistsModal.classList.remove("hide");
    }, 500); // Este valor debe coincidir con la duración de la animación (0.5s en este caso)
  }

  function showServerErrorModal() {
    const serverErrorModal = document.getElementById("serverErrorModal");
    serverErrorModal.style.display = "block";

    setTimeout(function () {
      closeServerErrorModal();
    }, 3000);
  }

  function closeServerErrorModal() {
    const serverErrorModal = document.getElementById("serverErrorModal");
    serverErrorModal.classList.add("hide");

    setTimeout(function () {
      serverErrorModal.style.display = "none";
      serverErrorModal.classList.remove("hide");
    }, 500); // Este valor debe coincidir con la duración de la animación (0.5s en este caso)
  }

  function validateForm() {
    let isValid = true;

    // Validar el nombre de usuario
    isValid = validateField(usernameInput, "Por favor, ingresa un usuario válido") && isValid;

    // Validar la contraseña
    isValid = validateField(passwordField, "Por favor, ingresa una contraseña válida") && isValid;

    // Validar la confirmación de la contraseña
    isValid = validateConfirmPassword() && isValid;

    // Validar el correo electrónico
    isValid = validateField(emailField, "Por favor, ingresa un correo electrónico válido") && isValid;

    // Validar el número de teléfono
    isValid = validateField(phoneField, "Por favor, ingresa un número de teléfono válido") && isValid;

    return isValid;
  }

  function isValidPhoneNumber(phone) {
    // Utiliza una expresión regular para verificar si solo contiene números
    return /^\d+$/.test(phone);
  }

  function validateField(inputElement, errorMessage) {
    if (inputElement.value.trim() === "") {
      showError(inputElement, errorMessage);
      return false;
    } else {
      hideError(inputElement);
      return true;
    }
  }

  function validateConfirmPassword() {
    const confirmPassword = confirmPasswordField.value.trim();
    if (confirmPassword === "") {
      showError(confirmPasswordField, "Por favor, confirma tu contraseña");
      return false;
    } else if (confirmPassword !== passwordField.value.trim()) {
      showError(confirmPasswordField, "Las contraseñas no coinciden");
      return false;
    } else {
      hideError(confirmPasswordField);
      return true;
    }
  }

  function showError(inputElement, errorMessage) {
    const errorElement = document.createElement("div");
    errorElement.classList.add("error-message");
    errorElement.textContent = errorMessage;

    const inputContainer = inputElement.parentElement;
    inputContainer.appendChild(errorElement);

    inputContainer.classList.add("error");

    inputElement.addEventListener("input", function () {
      inputContainer.classList.remove("error");
      inputContainer.removeChild(errorElement);
    });
  }

  function hideError(inputElement) {
    const inputContainer = inputElement.parentElement;
    const errorElement = inputContainer.querySelector(".error-message");
    if (errorElement) {
      inputContainer.classList.remove("error");
      inputContainer.removeChild(errorElement);
    }
  }
});
