// Importa las funciones necesarias desde los SDK que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// Constantes para selecciones DOM
const eyeIcon = document.querySelector(".eye-icon");
const passwordInput = document.getElementById("password");
const loginForm = document.querySelector("form");
const usernameInput = document.getElementById("username");
const passwordField = document.getElementById("password");

document.addEventListener("DOMContentLoaded", function () {
  setupEyeIcon();
  setupLoginForm();

  // Verificar si hay credenciales almacenadas en localStorage
  const storedUsername = localStorage.getItem("username");
  const storedPassword = localStorage.getItem("password");

  if (storedUsername && storedPassword) {
    // Si hay credenciales almacenadas, intentar iniciar sesión automáticamente
    autoLogin(storedUsername, storedPassword);
  }
});

function setupEyeIcon() {
  eyeIcon.addEventListener("click", togglePasswordVisibility);
}

function setupLoginForm() {
  loginForm.addEventListener("submit", handleLoginFormSubmit);
}

function togglePasswordVisibility() {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.innerHTML = '<i class="fa fa-eye-slash"></i>';
  } else {
    passwordInput.type = "password";
    eyeIcon.innerHTML = '<i class="fa fa-eye"></i>';
  }
}

async function autoLogin(username, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;

    console.log("Usuario ha iniciado sesión automáticamente:", user);
    window.location.href = "../pages/home_page.html";
  } catch (error) {
    console.error("Error al iniciar sesión automáticamente:", error.message);
    // Puedes manejar el error según sea necesario
  }
}

async function handleLoginFormSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const username = usernameInput.value;
  const password = passwordField.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;

    console.log("Usuario ha iniciado sesión:", user);

    // Almacenar las credenciales en localStorage si la casilla está marcada
    if (document.getElementById("rememberMe").checked) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    }

    window.location.href = "../pages/home_page.html";
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);

    // Verificar si el error está relacionado con el correo no encontrado
    if (error.code === "auth/user-not-found") {
      // Mostrar el modal de error de servidor
      showServerErrorModal();
    } else {
      // Otros errores pueden manejarse según sea necesario
      showServerErrorModal();
    }
  }
}

function validateForm() {
  let isValid = true;

  // Validar el nombre de usuario
  isValid = validateField(usernameInput, "Por favor, ingresa un usuario válido") && isValid;

  // Validar la contraseña
  isValid = validateField(passwordField, "Por favor, ingresa una contraseña válida") && isValid;

  return isValid;
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
