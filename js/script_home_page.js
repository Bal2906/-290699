//============================ Inicializacion FireBase =============================================
$(document).ready(function () {
    // Configuración de Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyD7ZFxfXta4Nh8F3sr94PP9BRaTXEJIWiw",
        authDomain: "pruebaconectiondb.firebaseapp.com",
        databaseURL: "https://pruebaconectiondb-default-rtdb.firebaseio.com",
        projectId: "pruebaconectiondb",
        storageBucket: "pruebaconectiondb.appspot.com",
        messagingSenderId: "836147307503",
        appId: "1:836147307503:web:b43799aaa1d68237d3cc1a"
    };

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    // Obtener referencia a la base de datos
    const db = firebase.database();

    var userId; // Variable para almacenar el ID del usuario
    var userRef; // Declarar userRef en un ámbito más amplio

    //============================ Sliderbar con FireBase =============================================

    // Obtener el nombre del usuario desde Firebase Realtime Database
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // El usuario está autenticado
            userId = user.uid;

            // Obtener referencia a la ubicación del usuario en la base de datos
            userRef = firebase.database().ref('usuarios/' + userId);

            // Agregar presencia
            var presenceRef = userRef.child('presence');
            presenceRef.onDisconnect().set(false);
            presenceRef.set(true);

            // Escuchar cambios en la presencia y actualizar la interfaz de usuario
            presenceRef.on("value", function (snapshot) {
                var isOnline = snapshot.val();
                updateConnectionStatus(isOnline);
            });

            // Obtener datos del usuario
            userRef.once('value').then(function (snapshot) {
                // Obtener los datos del usuario
                var userData = snapshot.val();

                if (userData) {
                    // Actualizar el HTML con los datos del usuario
                    var userName = userData.usuario;
                    var userImage = userData.imagenPerfil; // Obtener la URL de la imagen

                    // Actualizar el nombre del usuario en el menú
                    $(".user-details .name").text(userName);

                    // Crear una nueva imagen en memoria
                    var img = new Image();
                    img.onload = function () {
                        // La imagen se ha cargado correctamente
                        // Actualizar la imagen del usuario en el menú
                        $(".user-img img").attr("src", userImage);
                    };
                    img.src = userImage; // Asignar la URL de la imagen para cargarla
                } else {
                    console.log("No se encontraron datos del usuario en la base de datos");
                }
            }).catch(function (error) {
                console.log("Error al obtener datos del usuario: ", error);
            });
        } else {
            // El usuario no está autenticado, realiza alguna acción o redirige a la página de inicio de sesión
            console.log("Usuario no autenticado");
        }
    });

    $(".menu > ul > li").click(function (e) {
        // Remove active from already active
        $(this).siblings().removeClass("active");
        // Add active to clicked
        $(this).toggleClass("active");
        // if has sub menu open it
        $(this).find("ul").slideToggle();
        // close other sub menu if any open
        $(this).siblings().find("ul").slideUp();
        // remove active class of sub menu item
        $(this).siblings().find("ul").find("li").removeClass("active");
    });

    $(".menu-btn").click(function () {
        $(".sidebar").toggleClass("active");
    });

    // Otros eventos de clic para cambiar a otras páginas
    $("#home-link, #profile-link, #posts-link, #categories-link, #help-link, #logout-link").click(function (event) {
        event.preventDefault(); // Evitar la recarga de la página

        // Desactivar todas las clases active
        $(".menu > ul > li").removeClass("active");

        // Activar la clase active solo en el enlace seleccionado
        $(this).addClass("active");
    });

    // Mostrar el modal al hacer clic en "Logout"
    $("#logoutLink").click(function (e) {
        e.preventDefault(); // Evitar que el enlace redirija directamente
        $("#logoutModal").fadeIn();
    });

    // Ocultar el modal al hacer clic en "Cancelar"
    $("#cancelLogout").click(function () {
        $("#logoutModal").fadeOut();
    });

    // Implementar la lógica de cierre de sesión al confirmar
    $("#confirmLogout").click(function () {
        // Limpiar las credenciales almacenadas en localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("password");

        // Aquí debes implementar la lógica para cerrar sesión
        // Por ejemplo, redirigir a la página de inicio de sesión
        window.location.href = "../index.html";

        // Limpiar el historial para que no pueda volver atrás
        window.history.replaceState(null, null, "../index.html");
    });

    // Función para actualizar el estado de conexión en la interfaz de usuario
    function updateConnectionStatus(isOnline) {
        var titleElement = $(".user-details .title");

        if (isOnline) {
            titleElement.text("Connected").css("color", "green");
        } else {
            titleElement.text("Disconnected").css("color", "red");
        }
    }

    //============================ Contenido de la pagina dinamicamente por defecto =============================================

    // Maneja la carga inicial del contenido en home por defecto
    $(document).ready(function () {
        loadHomePage();
    });

    // Evento de clic para cambiar a la página Home
    $("#home-link").click(function (event) {
        event.preventDefault(); // Evitar la recarga de la página
        loadHomePage();
    });

    // Función para cargar el contenido específico de la página
    function loadPageContent(content) {
        // Oculta el contenedor para la transición
        $(".content-container").removeClass("loaded");

        // Espera un breve período de tiempo antes de cambiar el contenido
        setTimeout(function () {
            // Cambia el contenido del contenedor
            $("#page-content").html(content);

            // Agrega la clase para mostrar la transición
            $(".content-container").addClass("loaded");

            // Si es la página Home, actualiza la fecha
            if (content.includes("Bienvenido a la página Home")) {
                updatePostDate();
            }
        }, 300); // 300 milisegundos (ajusta según sea necesario)
    }

    //============================ Contenido dinamico de la pestaña home =============================================

    // Función para cargar la página Home
    function loadHomePage() {
        var homeContent = `
        <div class="posts-container">
            ${createPostHTML("Nombre del Usuario", "../assets/icons/icon-profile.png", "Me siento muy emocionado", "../assets/images/background.jpg", 100, 200, 50, "Fecha de la publicación")}
            ${createPostHTML("Nombre del Usuario", "../assets/icons/icon-profile.png", "Me siento muy emocionado", "../assets/images/background.jpg", 100, 200, 50, "Fecha de la publicación")}
            ${createPostHTML("Nombre del Usuario", "../assets/icons/icon-profile.png", "Me siento muy emocionado", "../assets/images/6.png", 100, 200, 50, "Fecha de la publicación")}
            ${createPostHTML("Nombre del Usuario", "../assets/icons/icon-profile.png", "Me siento muy emocionado", "../assets/images/background.jpg", 100, 200, 50, "Fecha de la publicación")}
            ${createPostHTML("Nombre del Usuario", "../assets/icons/icon-profile.png", "Me siento muy emocionado", "../assets/images/background.jpg", 100, 200, 50, "Fecha de la publicación")}

            <!-- Agrega más llamadas a createPostHTML según sea necesario -->
        </div>
        `;

        loadPageContent(homeContent);

    }

    // Función para actualizar la fecha del post
    function updatePostDate() {
        // Obtén el elemento donde deseas mostrar la fecha (sustituye "postDate" con el ID o selector correcto)
        var postDateElement = $("#postDate");

        // Obtén la fecha actual
        var currentDate = new Date();

        // Formatea la fecha como mm/dd/yyyy
        var formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

        // Asigna la fecha al elemento
        postDateElement.text(formattedDate);
    }

    // Función para agregar un comentario al DOM
    function addCommentToDOM(username, avatarSrc, commentText) {
        $("#commentsSection").append(createCommentHTML(username, avatarSrc, commentText));
    }

    // Ejemplo de uso:
    addCommentToDOM("Usuario1", "https://via.placeholder.com/30", "Este es un comentario de prueba.");
    addCommentToDOM("Usuario2", "https://via.placeholder.com/30", "Otro comentario de prueba.");
    // Puedes llamar a addCommentToDOM tantas veces como sea necesario para agregar comentarios adicionales.

    //============================ Contenido dinamico de la pestaña Profile =============================================
    // Función para formatear números en formato abreviado (ej. 1000 a 1k, 1000000 a 1M, etc.)
    function formatNumber(number) {
        if (number >= 1e6) {
            return (number / 1e6).toFixed(1) + 'M';
        } else if (number >= 1e3) {
            return (number / 1e3).toFixed(1) + 'K';
        } else {
            return number.toString();
        }
    }

    function formatTimeElapsed(seconds) {
        if (seconds < 60) {
            return seconds + 's';
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return minutes + 'm' + (remainingSeconds > 0 ? remainingSeconds + 's' : '');
        } else {
            const hours = Math.floor(seconds / 3600);
            const remainingMinutes = Math.floor((seconds % 3600) / 60);
            return hours + 'h' + (remainingMinutes > 0 ? remainingMinutes + 'm' : '');
        }
    }

    // Funciones de actualización y modales
    function updateUsername() {
        var newUsername = $("#newUsername").val();

        // Validar si se ingresó un nuevo nombre de usuario
        if (newUsername.trim() === "") {
            console.log("El nuevo nombre de usuario no puede estar vacío.");
            return;
        }

        // Actualizar el nombre de usuario en la base de datos
        userRef.update({
            usuario: newUsername
        }).then(function () {
            console.log("Nombre de usuario actualizado correctamente.");
            $("#usernameModal").hide();
            // Actualizar dinámicamente el nombre de usuario en la página
            $(".profile-username").text(newUsername);
            // Actualizar dinámicamente el nombre de usuario en el menu
            $(".name").text(newUsername);
            // location.reload();
        }).catch(function (error) {
            console.error("Error al actualizar el nombre de usuario:", error);
        });
    }

    function updateBio() {
        var newBio = $("#newBio").val();

        // Validar si se ingresó una nueva biografía
        if (newBio.trim() === "") {
            console.log("La nueva biografía no puede estar vacía.");
            return;
        }

        // Actualizar la biografía en la base de datos
        userRef.update({
            bioDescription: newBio
        }).then(function () {
            console.log("Biografía actualizada correctamente.");
            $("#bioModal").hide();
            // Actualizar dinámicamente la biografía en la página (opcional)
            $(".profile-bio").text(newBio);
            // location.reload();
        }).catch(function (error) {
            console.error("Error al actualizar la biografía:", error);
        });
    }

    function openUsernameModal() {
        console.log("Abriendo modal de edición de usuario");
        $("#newUsername").val(""); // Limpiar el campo de nuevo nombre de usuario al abrir el modal
        $("#usernameModal").show();
    }

    function openBioModal() {
        console.log("Abriendo modal de edición de biografía");
        $("#newBio").val(""); // Limpiar el campo de nueva biografía al abrir el modal
        $("#bioModal").show();
    }

    function closeUsernameModal() {
        $("#usernameModal").hide();
    }

    function closeBioModal() {
        $("#bioModal").hide();
    }

    // Función para abrir el modal y mostrar las imágenes de portada
    function openModalCoverChange() {
        // Limpiar las columnas
        $("#imageColumn1").empty();
        $("#imageColumn2").empty();

        // Supongamos que tienes un array de objetos con nombres de archivo en Firebase Storage
        var fileNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.webp'];

        // Obtener las URL de descarga para cada imagen
        var downloadPromises = fileNames.map(function (fileName) {
            return getDownloadUrl(fileName);
        });

        // Esperar a que todas las promesas se resuelvan
        Promise.all(downloadPromises).then(downloadUrls => {
            // Dividir las URL en dos columnas
            var column1 = downloadUrls.slice(0, Math.ceil(downloadUrls.length / 2));
            var column2 = downloadUrls.slice(Math.ceil(downloadUrls.length / 2));

            // Llenar dinámicamente las columnas
            fillColumn("imageColumn1", column1);
            fillColumn("imageColumn2", column2);

            // Mostrar el modal
            $("#coverModalChange").show();
        });
    }

    // Función para obtener la URL de descarga para un archivo en Firebase Storage
    function getDownloadUrl(fileName) {
        // Reemplaza 'tu_ruta_en_firebase_storage' con la ruta real en tu Firebase Storage
        var storageRef = firebase.storage().ref('default/coversProfile/' + fileName);

        // Obtener la URL de descarga
        return storageRef.getDownloadURL().then(url => {
            return url;
        }).catch(error => {
            console.error("Error al obtener la URL de descarga:", error);
            // Puedes manejar el error de alguna manera, por ejemplo, devolviendo una URL de imagen de respaldo
            return 'URL_DE_RESPALDO';
        });
    }

    // Función para llenar dinámicamente una columna con imágenes y títulos
    function fillColumn(columnId, downloadUrls) {
        var columnElement = $("#" + columnId);

        downloadUrls.forEach(function (url) {
            var imageItem = $("<div class='image-item'>");
            var image = $("<img draggable='false'>").attr("src", url).attr("alt", "Imagen");

            // Añadir evento de clic a la imagen
            image.click(function () {
                // Función para cambiar la imagen de portada y cerrar el modal
                changeCoverImageAndCloseModal(url);
            });

            imageItem.append(image);
            columnElement.append(imageItem);
        });
    }

    function changeCoverImageAndCloseModal(newImageUrl) {
        // Obtener la referencia del usuario actual en la base de datos
        var userUid = firebase.auth().currentUser.uid; // Asegúrate de haber inicializado Firebase Authentication
        var userRef = firebase.database().ref('usuarios/' + userUid);

        // Cambiar la imagen de portada en la base de datos
        userRef.update({
            imagenPortada: newImageUrl
        }).then(function () {
            console.log("URL de la imagen de portada actualizada en la base de datos.");

            // Cambiar la imagen de portada en la interfaz de usuario
            $("#coverImageElement").attr("src", newImageUrl);

            // Cerrar el modal
            closeModalCoverChange();
        }).catch(function (error) {
            console.error("Error al actualizar la URL de la imagen de portada:", error);
        });
    }

    // Función para cerrar el modal
    function closeModalCoverChange() {
        $("#coverModalChange").hide();
    }

    $(document).on("click", "#updateDataUsername", function () {
        updateUsername();
    });

    $(document).on("click", "#updateDataBio", function () {
        updateBio();
    });

    $(document).on("click", "#cancelUpdateUsername", function () {
        closeUsernameModal();
    });

    $(document).on("click", "#cancelUpdateBio", function () {
        closeBioModal();
    });

    // Agregar evento de clic al botón "Change Cover"
    $(document).on("click", "#changeCoverButton", function () {
        openModalCoverChange();
    });

    $(document).on("click", "#closeCoverModalChange", function () {
        closeModalCoverChange();
    });

    // Declarar la función para cargar el contenido de la página de perfil
    function loadProfilePage() {
        console.log("Cargando la página de perfil...");

        // Obtener datos del usuario
        userRef.once('value').then(function (snapshot) {
            console.log("Datos del usuario obtenidos:", snapshot.val());
            // Obtener los datos del usuario
            var userData = snapshot.val();

            // Declarar userUid aquí
            var userUid;

            if (userData) {
                // Asignar el valor a userUid
                userUid = firebase.auth().currentUser.uid;
                // Actualizar el HTML con los datos del usuario
                var userName = userData.usuario; // Cambiar de 'usuario' a 'nombre'
                var userEmail = userData.correo;
                var userBio = userData.bioDescription;
                var fechaInicio = userData.fechaCreacion;
                var userStatus = userData.presence ? 'Conectado' : 'Desconectado'; // Cambiar a 'presence'
                var profileUserUrl = userData.imagenPerfil;
                var coverImageUrl = userData.imagenPortada;

                var statisticsRef = firebase.database().ref('accountStatistics/' + userUid);
                statisticsRef.once('value').then(function (statisticsSnapshot) {
                    var statisticsData = statisticsSnapshot.val();

                    if (statisticsData) {
                        // Utilizar los valores dinámicos para los contadores
                        var followersCount = statisticsData.followersCount;
                        var followingCount = statisticsData.followingCount;
                        var totalLikesCount = statisticsData.profileLikesCount;
                        var totalPostsCount = statisticsData.totalPostsCount;
                        var totalStoriesCount = statisticsData.totalStoriesCount;
                        var totalHoursCount = statisticsData.activityHoursCount;

                        var profileContent = `
                    <div class="profile-container">
                        <div class="cover-image">
                            <!-- Botón para cambiar la portada -->
                            <button id="changeCoverButton" class="change-cover-button"><i class="ph ph-dots-three-circle"></i>Change Cover</button>
                            <!-- Contenido de la imagen de portada -->
                            <img id="coverImageElement" src="${coverImageUrl}" alt="Imagen de portada" draggable="false">
                        </div>

                        <div class="profile-header">
                            <!-- Contenido de la imagen de perfil y detalles del usuario -->
                            <div class="profile-user-myperfil-img">
                                <!-- Coloca directamente la URL de la imagen del usuario -->
                                <img src="${profileUserUrl}" alt="Nombre de usuario" draggable="false">
                            </div>
                            <div class="profile-user-details">
                                <!-- Coloca directamente los datos del usuario -->
                                <p class="profile-username">${userName}<i class="ph-fill ph-note-pencil icon-username" id="iconoEditUsername"></i></p>
                                <p class="profile-bio">${userBio}<i class="ph-fill ph-note-pencil icon-bio" id="iconoEditBio"></i></p>
                                <!-- Nuevos botones de suscripción y Me gusta -->
                                <button id="followButton" class="subscribe-button"><i class="ph-fill ph-user-plus"></i>Follow</button>
                                <button id="likeButton" class="like-button"><i class="ph-fill ph-heart"></i>Like</button>
                            </div>
                        </div>

                        <!-- Agregar un contenedor para las secciones -->
                        <div class="profile-section-container">
                            <div class="ph profile-section" id="profile-section">
                                <i class="ph ph-user"></i>
                                <p>Profile</p>
                                <!-- Agregar campos para nombre, correo y estado de conexión -->
                                <div class="profile-details">
                                    
                                    <label for="email">Correo:</label>
                                    <span class="profile-email">${userEmail}</span>
                                    
                                    <label for="status">Estado de Conexión:</label>
                                    <span class="profile-status">${userStatus}</span>

                                    <label for="createDate">Se unio:</label>
                                    <span class="profile-createDate">${formatDate(fechaInicio)}</span>
                                </div>
                            </div>

                            <div class="followers-section" id="followers-section">
                                <i class="ph ph-users"></i>
                                <p>Followers</p>
                                <!-- Utilizar el valor dinámico para el contador de seguidores -->
                                <span class="counter" id="followers-counter">${formatNumber(followersCount)}</span>
                            </div>

                            <div class="following-section" id="following-section">
                                <i class="ph-fill ph-user-circle-plus"></i>
                                <p>Following</p>
                                <!-- Utilizar el valor dinámico para el contador de seguidores -->
                                <span class="counter" id="following-counter">${formatNumber(followingCount)}</span>
                            </div>

                            <div class="totalLikes-section" id="totalLikes-section">
                                <i class="ph-fill ph-heart"></i>
                                <p>Likes</p>
                                <!-- Utilizar el valor dinámico para el contador de posts -->
                                <span class="counter" id="totalLikes-counter">${formatNumber(totalLikesCount)}</span>
                            </div>

                            <div class="totalPosts-section" id="totalPosts-section">
                                <i class="ph-fill ph-note"></i>
                                <p>Posts</p>
                                <!-- Utilizar el valor dinámico para el contador de posts -->
                                <span class="counter" id="totalPosts-counter">${formatNumber(totalPostsCount)}</span>
                            </div>

                            <div class="totalStories-section" id="totalStories-section">
                                <i class="ph-fill ph-slideshow"></i>
                                <p>Stories</p>
                                <!-- Utilizar el valor dinámico para el contador de posts -->
                                <span class="counter" id="totalStories-counter">${formatNumber(totalStoriesCount)}</span>
                            </div>

                            <div class="totalTime-section" id="totalTime-section">
                                <i class="ph ph-clock"></i>
                                <p>Time Activity</p>
                                <!-- Utilizar el valor dinámico para el contador de horas de interacción -->
                                <span class="counter" id="totalTime-counter">${formatTimeElapsed(totalHoursCount)}</span>
                            </div>
                        </div>
                    </div>
                `;

                        loadPageContent(profileContent);

                        // Agregar eventos de clic a los íconos de lápiz
                        // Usar el método on para agregar eventos de clic a los íconos de lápiz
                        $(document).on("click", "#iconoEditUsername", function (event) {
                            event.preventDefault();
                            console.log("Clic en el ícono de edición de usuario");
                            openUsernameModal();
                        });

                        $(document).on("click", "#iconoEditBio", function (event) {
                            event.preventDefault();
                            console.log("Clic en el ícono de edición de biografía");
                            openBioModal();
                        });

                    } else {
                        console.log("No se encontraron datos de estadísticas en la base de datos");
                    }
                }).catch(function (statisticsError) {
                    console.error("Error al obtener datos de estadísticas:", statisticsError);
                });
            } else {
                console.log("No se encontraron datos del usuario en la base de datos");
            }
        }).catch(function (error) {
            console.log("Error al obtener datos del usuario: ", error);
        });
    }

    // Agrega un evento de clic al botón "Follow"
    $(document).on("click", "#followButton", function () {
        var buttonText = $(this).text();

        // Verifica si el botón tiene el texto "Follow"
        if (buttonText.trim() === "Follow") {
            // Cambia el texto a "Following"
            $(this).html('<i class="ph-fill ph-check-circle"></i>Following');

            // Cambia el color del botón y el ícono
            $(this).css("background-color", "#4CAF50"); // Cambia el color de fondo del botón a verde
            $(this).find("i").css("color", "#fff"); // Cambia el color del ícono a blanco
        } else {
            // Puedes manejar el caso inverso si el botón tiene el texto "Following"
            // Cambia el texto a "Follow"
            $(this).html('<i class="ph-fill ph-user-plus"></i>Follow');

            // Restablece el color del botón y el ícono
            $(this).css("background-color", "#3498db"); // Restablece el color de fondo del botón
            $(this).find("i").css("color", "#fff"); // Restablece el color del ícono
        }
    });

    // Agrega un evento de clic al botón "Me gusta"
    $(document).on("click", "#likeButton", function () {
        var buttonText = $(this).text();

        // Verifica si el botón tiene el texto "Me gusta"
        if (buttonText.trim() === "Like") {
            // Cambia el texto a "Liked"
            $(this).html('<i class="ph-fill ph-thumbs-down"></i> Unliked');

            // Cambia el color del botón y el ícono
            $(this).css("background-color", "#e74c3c"); // Cambia el color de fondo del botón a rojo
            $(this).find("i").css("color", "#fff"); // Cambia el color del ícono a blanco
        } else {
            // Puedes manejar el caso inverso si el botón tiene el texto "Liked"
            // Cambia el texto a "Me gusta"
            $(this).html('<i class="ph-fill ph-heart"></i> Like');

            // Restablece el color del botón y el ícono
            $(this).css("background-color", "#3498db"); // Restablece el color de fondo del botón
            $(this).find("i").css("color", "#fff"); // Restablece el color del ícono
        }
    });

    // Manejar el clic en la pestaña "My Profile"
    $("#myProfile-link").click(function (event) {
        event.preventDefault();
        loadProfilePage();
    });

    //============================ Contenido dinámico de la pestaña Gallery Image =============================================

    // Función para cargar y mostrar la galería de imágenes desde Firebase Realtime Database
    function loadMyImagesGalleryFromDatabase(userId) {
        const userPostsRef = db.ref('posts/' + userId);

        userPostsRef.once('value')
            .then(handleSnapshot)
            .catch(handleError);
    }

    // Función para manejar el snapshot de los posts del usuario
    function handleSnapshot(snapshot) {
        if (!snapshot.exists()) {
            console.log("No hay posts en la base de datos.");
            return;
        }

        const galleryHTML = buildGalleryHTML(snapshot);
        loadPageContent(galleryHTML);
    }

    // Función para construir el HTML de la galería a partir del snapshot
    function buildGalleryHTML(snapshot) {
        let galleryHTML = '<div class="gallery-container">';

        snapshot.forEach((postSnapshot) => {
            const post = postSnapshot.val();
            const creationDate = formatDate(post.postDate);

            galleryHTML += buildGalleryItem(post.postImage, creationDate);
        });

        galleryHTML += '</div>';
        return galleryHTML;
    }

    // Función para manejar errores al cargar la galería
    function handleError(error) {
        console.error("Error al cargar la galería desde la base de datos:", error);
    }

    // Función para construir el HTML de un elemento de la galería
    function buildGalleryItem(imageUrl, title) {
        return `
        <div class="gallery-item">
            <img src="${imageUrl}" alt="${title}" class="gallery-img">
            <h2 class="gallery-title">${title}</h2>
        </div>
    `;
    }

    // Función para formatear la fecha del post
    function formatDate(dateString) {
        return new Date(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1')).toLocaleDateString();
    }

    // Evento de clic en las imágenes de la galería
    $(document).on("click", ".gallery-img", function () {
        const imageUrl = $(this).attr("src");
        showModal(imageUrl);
    });

    // Función para mostrar el modal con la imagen clicada
    function showModal(imageUrl) {
        $("#modalImagePost").attr("src", imageUrl);
        $("#myModalImagePost").css("display", "block");
    }

    // Evento de clic en el botón de cerrar del modal
    $(".closeModalImagePost").click(function () {
        hideModal();
    });

    // Función para ocultar el modal
    function hideModal() {
        $("#myModalImagePost").css("display", "none");
    }

    // Evento de clic fuera del modal para cerrarlo
    $(window).click(function (event) {
        if (event.target.id === "myModalImagePost") {
            hideModal();
        }
    });

    // Evento de clic en #myImages-link
    $("#myImages-link").click(function () {
        const user = firebase.auth().currentUser;

        if (user) {
            const userId = user.uid;
            loadMyImagesGalleryFromDatabase(userId);
        } else {
            console.error("No hay usuario autenticado.");
            // Manejar la situación en la que no hay usuario autenticado
        }
    });


    //============================ Contenido dinamico de la pestaña Create Post =============================================

    // Variable para almacenar las publicaciones dinámicas
    var dynamicPosts = [];

    // Función para crear el formulario de creación de publicaciones
    function createPostForm() {
        return `
        <div class="createPost-container">
            <div class="custom-create-post-form">
                <textarea id="postStatusInput" class="custom-post-status-input" placeholder="Escribe tu estado..."></textarea>
                
                <label for="postImageInput" class="custom-file-upload">
                    Seleccionar archivo
                    <input type="file" id="postImageInput" class="custom-post-image-input" accept="image/*" />
                </label>
            
                <div id="imagePreviewContainer" class="imagePreviewContainer">
                    <!-- Aquí se mostrará la previsualización de la imagen -->
                </div>
                
                <div class="publish-btn-container">
                    <button id="publishBtn" class="custom-publish-btn">Publicar</button>
                </div>

            </div>
        </div>    
    
        `;
    }

    // Evento de cambio en #postImageInput
    $(document).on("change", "#postImageInput", function () {
        // Obtener el input de la imagen y el contenedor de la previsualización
        var postImageInput = this;
        var imagePreviewContainer = $("#imagePreviewContainer");

        // Limpiar cualquier previsualización existente
        imagePreviewContainer.empty();

        // Verificar si se ha seleccionado un archivo
        if (postImageInput.files && postImageInput.files[0]) {
            var reader = new FileReader();

            // Configurar la función de devolución de llamada cuando la lectura del archivo esté completa
            reader.onload = function (e) {
                // Crear un elemento de imagen para la previsualización
                var imagePreview = $("<img>").attr("src", e.target.result).addClass("preview-image");

                // Agregar la imagen al contenedor de previsualización
                imagePreviewContainer.append(imagePreview);
            };

            // Leer el archivo como una URL de datos
            reader.readAsDataURL(postImageInput.files[0]);
        }
    });

    // Evento de clic en #publishBtn
    $(document).on("click", "#publishBtn", function () {
        console.log("Botón publish pulsado");

        // Obtener los valores del formulario
        var status = $("#postStatusInput").val();
        var postImageInput = $("#postImageInput")[0];

        // Verificar que se hayan ingresado el estado y la imagen antes de crear la publicación
        if (status && postImageInput.files.length > 0) {
            // Obtener la imagen del input
            var postImageFile = postImageInput.files[0];

            // Mostrar modal de creación de post
            showPostCreationModal("loadingSection", "Estamos creando su post. Por favor, espere...");

            // Obtener el usuario actualmente autenticado
            var user = firebase.auth().currentUser;

            if (user) {
                var userId = user.uid;

                // Crear una referencia al nodo "accountStatistics" del usuario
                var accountStatisticsRef = db.ref('accountStatistics/' + userId);

                console.log("Usuario autenticado:", userId);

                // Crear una referencia al nodo "posts" del usuario
                const postsRef = db.ref('posts/' + userId);

                // Crear un nuevo nodo para el post
                const newPostRef = postsRef.push();

                // Generar un nuevo ID para el post
                const postId = newPostRef.key;

                console.log("Nuevo post ID generado:", postId);

                // Crear una referencia a la carpeta del usuario en Firebase Storage
                const userStorageRef = firebase.storage().ref('usuarios/' + userId);

                // Crear una subcarpeta llamada "Posts" dentro de la carpeta del usuario en Firebase Storage
                const postsStorageRef = userStorageRef.child('Posts');

                // Crear una referencia específica para la imagen del post en la subcarpeta "Posts"
                const postImageRef = postsStorageRef.child(postId + '_' + postImageFile.name);

                console.log("Referencia a la imagen del post creada:", postImageRef);

                // Subir la imagen del post a Firebase Storage
                postImageRef.put(postImageFile).then((snapshot) => {
                    // Obtener la URL de descarga de la imagen del post
                    snapshot.ref.getDownloadURL().then((downloadURL) => {
                        console.log("Imagen del post subida a Firebase Storage:", downloadURL);

                        // Agregar los datos del post al nuevo nodo
                        newPostRef.set({
                            status: status,
                            postImage: downloadURL,
                            likeCount: 0,
                            viewsCount: 0,
                            commentCount: 0,
                            postDate: new Date().toLocaleString()
                            // Otros campos que desees almacenar
                        });

                        console.log("Datos del post almacenados en la base de datos.");

                        // Obtener la longitud actual del contador de posts en accountStatistics
                        accountStatisticsRef.child('totalPostsCount').once('value').then((snapshot) => {
                            var currentTotalPostsCount = snapshot.val() || 0;

                            // Incrementar el contador
                            currentTotalPostsCount++;

                            // Actualizar el contador de posts en accountStatistics
                            accountStatisticsRef.update({
                                totalPostsCount: currentTotalPostsCount
                            }).then(() => {
                                console.log("Contador de posts actualizado en accountStatistics.");
                            }).catch((error) => {
                                console.error("Error al actualizar el contador de posts:", error);
                            });
                        });

                        // Mostrar modal de éxito
                        showPostCreationModal("successSection", "Post creado con éxito!");

                        // Limpiar el formulario después de publicar
                        clearForm();

                    }).catch((error) => {
                        console.error("Error al obtener la URL de descarga:", error);
                        // Mostrar modal de error si hay un problema con la URL de descarga
                        showPostCreationModal("errorSection", "Error al obtener la URL de descarga. Por favor, inténtelo de nuevo.");
                    });
                }).catch((error) => {
                    console.error("Error al subir la imagen del post:", error);
                    // Mostrar modal de error si hay un problema al subir la imagen
                    showPostCreationModal("errorSection", "Error al subir la imagen del post. Por favor, inténtelo de nuevo.");
                });
            } else {
                console.error("No hay usuario autenticado.");
                // Mostrar modal de error si no hay usuario autenticado
                showPostCreationModal("errorSection", "No hay usuario autenticado. Por favor, inicie sesión.");
            }
        } else {
            // Mostrar un mensaje de error si falta algún campo
            alert("Por favor, complete todos los campos antes de publicar.");
        }
    });

    // Función para mostrar el modal y cambiar dinámicamente los mensajes
    function showPostCreationModal(sectionId, message) {
        // Ocultar todas las secciones
        $("#loadingSection, #uploadingSection, #successSection").hide();

        // Mostrar la sección específica y establecer el mensaje
        $("#" + sectionId).show().find("p").text(message);

        // Mostrar el modal
        $("#postCreationModal").show();

        // Ocultar automáticamente después de 6 segundos (ajusta según sea necesario)
        setTimeout(function () {
            $("#postCreationModal").hide();
        }, 6000);
    }

    // Función para limpiar el formulario después de publicar
    function clearForm() {
        $("#postStatusInput").val("");
        $("#postImageInput").val("");
        $("#imagePreviewContainer").empty(); // Limpiar la previsualización de la imagen si existe
    }

    // Evento de clic en #createPosts-link
    $("#createPosts-link").click(function () {
        // Mostrar el formulario de creación de publicaciones
        var createPostFormHTML = createPostForm();
        loadPageContent(createPostFormHTML);
    });

    //============================ Contenido dinamico de la pestaña My Posts =============================================

    function createPostHTML(username, userImage, status, postImage, likeCount, viewsCount, commentCount, postDate, postId) {
        return `
            <div class="post">
                <div class="user-info">
                    <div class="profile-user-img">
                        <img src="${userImage}" alt="${username}" draggable="false">
                    </div>
                    <div class="user-info-details">
                        <p class="name-users">${username}</p> 
                        <button class="subscribe-btn">Suscribirse</button>
                    </div>
                </div>
    
                <div class="description-container">
                    <p class="description-status">${status}</p>
                </div>
    
                <div class="post-content">
                    <!-- Contenido de la publicación -->
                    <img src="${postImage}" alt="Descripción de la publicación" class="publish-content" data-post-id="${postId}" draggable="false">
                </div>
    
                <div class="post-interactions">
                    <div class="left-icons">
                        <div class="like-icon">
                            <button class="like-btn" data-post-id="${postId}">
                                <i class="ph-fill ph-heart"></i>
                                <span class="count">${likeCount}</span>
                            </button>
                        </div>
                        <div class="views-icon">
                            <i class="ph-fill ph-eye"></i>
                            <span class="count">${viewsCount}</span>
                        </div>
                        <div class="comment-icon">
                            <i class="ph-fill ph-chat"></i>
                            <span class="count">${commentCount}</span>
                        </div>
                    </div>
    
                    <div class="post-date">
                        <!-- Agrega aquí la fecha del post -->
                        <span class="date">${postDate}</span>
                    </div>
    
                    <div class="comment-button-container">
                        <button id="openCommentsModalBtn" class="modalComentsbtn" data-post-id="${postId}">Show Comments</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Funciones de modal de comentarios
    function createCommentHTML(username, avatarSrc, commentText) {
        return `
                <div class="comment">
                    <div class="user-avatar">
                        <img src="${avatarSrc}" alt="${username} Avatar">
                    </div>
                    <div class="comment-content">
                        <p class="user-name">${username}:</p>
                        <p>${commentText}</p>
                    </div>
                </div>
            `;
    }

    // Evento de clic en #myPosts-link
    $("#myPosts-link").click(function () {
        // Obtener el usuario actualmente autenticado
        var user = firebase.auth().currentUser;

        if (user) {
            var userId = user.uid;

            // Crear una referencia al nodo "posts" del usuario
            const userPostsRef = db.ref('posts/' + userId);

            // Obtener las publicaciones del usuario
            userPostsRef.once('value').then(function (snapshot) {
                console.log("Publicaciones obtenidas con éxito:", snapshot.val());

                // Limpiar el array de publicaciones dinámicas
                dynamicPosts = [];

                // Iterar sobre las publicaciones y agregarlas al array
                snapshot.forEach(function (childSnapshot) {
                    var post = childSnapshot.val();

                    // Agregar un contador de vistas a la estructura de datos de la publicación
                    post.viewsCount = post.viewsCount || 0; // Inicializar el contador si no existe
                    var postId = childSnapshot.key;

                    if (postId) {  // Verificar si postId está definido
                        // Crear una referencia a la publicación específica
                        const specificPostRef = db.ref('posts/' + userId + '/' + postId);

                        // Obtener la información del usuario
                        const userRef = db.ref('usuarios/' + userId);

                        userRef.once('value').then(function (userSnapshot) {
                            var userInfo = userSnapshot.val();
                            console.log("postId:", postId);
                            dynamicPosts.push(createPostHTML(userInfo.usuario, userInfo.imagenPerfil, post.status, post.postImage, post.likeCount, post.viewsCount, post.commentCount, post.postDate, postId));

                            // Verificar si es la última iteración
                            if (dynamicPosts.length === snapshot.numChildren()) {
                                // Mostrar todas las publicaciones (estáticas + dinámicas)
                                var staticContent = '<div class="posts-container">' +
                                    dynamicPosts +
                                    '</div>';

                                // Mostrar el contenido combinado en la página
                                loadPageContent(staticContent);

                                // Evento de clic en las imágenes de los posts usando delegación
                                $(document).on('click', '.post-content img', function () {
                                    var modal = $(".modalImagePost");
                                    var modalImage = $(".modal-content-ImagePost");

                                    // Obtener la URL de la imagen del post clicado
                                    var postImageSrc = $(this).attr("src");

                                    // Mostrar la imagen en el modal
                                    modalImage.attr("src", postImageSrc);
                                    modal.css("display", "block");

                                    // Obtener el ID de la publicación asociada a la imagen
                                    var postId = $(this).data("post-id");

                                    // Actualizar la vista para mostrar el contador actualizado
                                    updateViewsCount(postId);
                                });

                                // Evento de clic al botón de cerrar en el modal
                                $(document).on('click', '.closeModalImagePost', function () {
                                    $(".modalImagePost").css("display", "none");
                                });

                            }
                        }).catch(function (error) {
                            console.error("Error al obtener información adicional del usuario:", error);
                        });
                    } else {
                        console.error("El postId es undefined. Publicación:", post);
                    }
                });
            }).catch(function (error) {
                console.error("Error al obtener las publicaciones del usuario:", error);
            });
        } else {
            console.error("No hay usuario autenticado.");
        }
    });



    function updateViewsCount(postId) {
        var user = firebase.auth().currentUser;
        var userId = user.uid;

        if (postId) {
            // Crear una referencia a la publicación específica
            const specificPostRef = db.ref('posts/' + userId + '/' + postId);

            // Obtener el valor actual del contador de vistas
            specificPostRef.once('value').then(function (snapshot) {
                var currentViews = snapshot.val().viewsCount || 0;

                // Incrementar el contador de vistas y actualizar la base de datos
                specificPostRef.update({
                    viewsCount: currentViews + 1
                }).then(function () {
                    console.log("Vistas actualizadas con éxito. Vistas actuales:", currentViews + 1);

                    // Actualizar la interfaz de usuario con el nuevo contador de vistas
                    updateViewsUI(postId, currentViews + 1);
                }).catch(function (error) {
                    console.error("Error al actualizar el contador de vistas:", error);
                });
            }).catch(function (error) {
                console.error("Error al obtener el valor actual del contador de vistas:", error);
            });
        } else {
            console.error("El postId es undefined.");
        }
    }


    // Función para actualizar la interfaz de usuario con el nuevo contador de vistas
    function updateViewsUI(postId, viewsCount) {
        // Encuentra el elemento correspondiente en el DOM y actualiza el contenido
        var viewsElement = $('[data-post-id="' + postId + '"]').closest('.post').find('.views-icon .count');
        if (viewsElement.length > 0) {
            viewsElement.text(viewsCount);
        }
    }

    // Evento de clic en el botón de "Me gusta"
    $(document).on('click', '.like-btn', function () {
        var postId = $(this).data("post-id");

        // Verificar si el botón no está deshabilitado
        if (!$(this).prop('disabled')) {
            // Verificar si el usuario ya ha dado like
            if ($(this).hasClass('liked')) {
                // Si ya le dio like, quitar el like
                removeLike(postId);
            } else {
                // Si no le ha dado like, agregar el like
                addLike(postId);
            }
        }
    });

    // Función para agregar el like
    function addLike(postId) {
        var user = firebase.auth().currentUser;
        var userId = user.uid;

        if (postId) {
            // Crear una referencia a la publicación específica
            const specificPostRef = db.ref('posts/' + userId + '/' + postId);

            specificPostRef.transaction(function (post) {
                // Incrementar el contador de likes y agregar el ID del usuario que dio like
                if (post) {
                    post.likeCount = (post.likeCount || 0) + 1;
                    post.likes = post.likes || {};
                    post.likes[userId] = true; // Marcar que el usuario actual dio like
                }
                return post;
            }, function (error, committed, snapshot) {
                if (error) {
                    console.error("Transacción fallida:", error);
                } else if (!committed) {
                    console.error("Transacción no confirmada.");
                } else {
                    // Mostrar el contador de likes actualizado
                    console.log("Likes actualizados con éxito. Likes actuales:", snapshot.val().likeCount);

                    // Actualizar la interfaz de usuario con el nuevo contador de likes y marcar el botón como "liked"
                    updateLikeUI(postId, snapshot.val().likeCount);
                    markAsLiked(postId);
                }
            });
        } else {
            console.error("El postId es undefined.");
        }
    }

    // Función para quitar el like
    function removeLike(postId) {
        var user = firebase.auth().currentUser;
        var userId = user.uid;

        if (postId) {
            // Crear una referencia a la publicación específica
            const specificPostRef = db.ref('posts/' + userId + '/' + postId);

            specificPostRef.transaction(function (post) {
                // Decrementar el contador de likes y quitar el ID del usuario que dio like
                if (post) {
                    post.likeCount = Math.max((post.likeCount || 0) - 1, 0);
                    post.likes = post.likes || {};
                    delete post.likes[userId]; // Quitar el marcaje de que el usuario actual dio like
                }
                return post;
            }, function (error, committed, snapshot) {
                if (error) {
                    console.error("Transacción fallida:", error);
                } else if (!committed) {
                    console.error("Transacción no confirmada.");
                } else {
                    // Mostrar el contador de likes actualizado
                    console.log("Likes actualizados con éxito. Likes actuales:", snapshot.val().likeCount);

                    // Actualizar la interfaz de usuario con el nuevo contador de likes y desmarcar el botón como "liked"
                    updateLikeUI(postId, snapshot.val().likeCount);
                    markAsNotLiked(postId);
                }
            });
        } else {
            console.error("El postId es undefined.");
        }
    }

    // Función para actualizar la interfaz de usuario con el nuevo contador de likes
    function updateLikeUI(postId, likeCount) {
        // Encuentra el elemento HTML del contador de likes y actualiza su contenido
        var likeCountElement = $(`.like-btn[data-post-id="${postId}"] .count`);

        if (likeCountElement.length > 0) {
            likeCountElement.text(likeCount);
        }
    }

    // Función para marcar el botón como "liked"
    function markAsLiked(postId) {
        $(`.like-btn[data-post-id="${postId}"]`).addClass('liked');
    }

    // Función para desmarcar el botón como "liked"
    function markAsNotLiked(postId) {
        $(`.like-btn[data-post-id="${postId}"]`).removeClass('liked');
    }


    // Evento de clic en el botón "Comentarios"
    $(document).on('click', '.modalComentsbtn', function () {
        var postId = $(this).data("post-id");
        openCommentsModal(postId);
    });

    // Modificar la función openCommentsModal para obtener información del usuario
    function openCommentsModal(postId) {
        // Asignar el ID del post al modal
        $("#commentsModal").data("post-id", postId);

        // Limpiar el contenido existente del modal
        $("#commentsSection").empty();

        // Configurar una referencia a la subcolección de comentarios del post
        const commentsRef = db.ref(`posts/${userId}/${postId}/comments`);

        // Obtener los comentarios
        commentsRef.once('value').then(function (snapshot) {
            snapshot.forEach(function (commentSnapshot) {
                var comment = commentSnapshot.val();

                // Obtener información del usuario desde la colección "usuarios"
                const userRef = db.ref(`usuarios/${comment.userId}`);
                userRef.once('value').then(function (userSnapshot) {
                    var userInfo = userSnapshot.val();

                    // Crear el HTML del comentario con el nombre del usuario y la imagen del perfil
                    var commentHtml = createCommentHTML(userInfo.nombre, userInfo.imagenPerfil, comment.commentText);
                    $("#commentsSection").append(commentHtml);
                }).catch(function (error) {
                    console.error("Error al obtener información del usuario:", error);
                });
            });
        });

        // Mostrar el modal
        $("#commentsModal").fadeIn();
    }

    function postComment(postId, userId, commentText) {
        // Verificar si postId, userId y commentText están definidos
        if (!postId || !userId || !commentText) {
            console.error("postId, userId o commentText es indefinido.");
            return;
        }

        // Obtener una referencia a la subcolección de comentarios del post
        const commentsRef = db.ref(`posts/${userId}/${postId}/comments`);

        // Agregar un nuevo comentario
        const newCommentRef = commentsRef.push({
            userId: userId,
            commentText: commentText,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        // Obtener la clave única del comentario recién agregado
        const commentId = newCommentRef.key;

        // Verificar si se obtuvo un commentId válido
        if (!commentId) {
            console.error("Error al obtener commentId.");
            return;
        }

        // Incrementar el contador de comentarios
        const postRef = db.ref(`posts/${userId}/${postId}`);
        postRef.transaction(function (post) {
            if (post) {
                post.commentCount = (post.commentCount || 0) + 1;
            }
            return post;
        }, function (error, committed, snapshot) {
            if (error) {
                console.error("Transacción fallida:", error);
            } else if (!committed) {
                console.error("Transacción no confirmada.");
            } else {
                // Actualizar la interfaz de usuario con el nuevo contador de comentarios
                updateCommentCountUI(postId, snapshot.val().commentCount);
            }
        });

        // Después de agregar el comentario, puedes actualizar la sección de comentarios si es necesario
        const commentHtml = createCommentHTML(userId, "https://via.placeholder.com/30", commentText);
        $("#commentsSection").append(commentHtml);

        // Limpiar el contenido del cuadro de comentarios
        $("#commentInput").val('');
    }

    // Evento de clic en el botón "Publicar Comentario" dentro del modal
    $(document).on('click', '#postCommentBtn', function () {
        const commentContent = $("#commentInput").val();
        const postId = $("#commentsModal").data("post-id");
        const userId = firebase.auth().currentUser?.uid;

        // Lógica para agregar el comentario al DOM o enviarlo a la base de datos
        postComment(postId, userId, commentContent);
    });

    // Función para actualizar la interfaz de usuario con el nuevo contador de comentarios
    function updateCommentCountUI(postId, commentCount) {
        // Encuentra el elemento HTML del contador de comentarios y actualiza su contenido
        var commentCountElement = $(`.modalComentsbtn[data-post-id="${postId}"]`).closest('.post').find('.comment-icon .count');
        if (commentCountElement.length > 0) {
            commentCountElement.text(commentCount);
        }
    }


    // Función para cerrar el modal de comentarios
    function closeCommentsModal() {
        $("#commentsModal").fadeOut();
    }

    // Evento de clic en el botón "Cerrar" del modal
    $(document).on('click', '#closeCommentsModalBtn', function () {
        closeCommentsModal();
    });

    //============================ Contenido dinamico de la pestaña Settings =============================================

    // Evento de clic para cambiar a la página de Configuración
    $("#settings-link").click(function (event) {
        event.preventDefault(); // Evitar la recarga de la página
        // Desactivar todas las clases active
        $(".menu > ul > li").removeClass("active");

        // Activar la clase active solo en el enlace de configuración
        $(this).addClass("active");

        loadSettingsPage();
    });

    // Función para cargar la página de Configuración
    function loadSettingsPage() {
        userRef = firebase.database().ref(`usuarios/${userId}`);

        userRef.once('value').then(function (snapshot) {
            var userData = snapshot.val();

            if (userData) {
                var settingsContent = `
                    <h2>Configuración de la Cuenta</h2>

                    <!-- Contenedor principal para las secciones -->
                    <div id="settings-container">
                        <!-- Sección para actualizar datos -->
                        <div class="update-info-section">
                            <h3>Actualizar Datos</h3>
                            <label for="firstName" class="label">Nombre:</label>
                            <input type="text" id="firstName" class="input-field" placeholder="Nombre actual" value="${userData.nombre || ''}">

                            <label for="lastName" class="label">Apellido:</label>
                            <input type="text" id="lastName" class="input-field" placeholder="Apellido actual" value="${userData.apellido || ''}">

                            <label for="phone" class="label">Teléfono:</label>
                            <input type="text" id="phone" class="input-field" placeholder="Teléfono actual" value="${userData.telefono || ''}">

                            <!-- Agrega más campos según sea necesario -->

                            <button id="saveInfoBtn" class="save-btn save-info-btn">Guardar Cambios</button>
                            <button id="cancelInfoBtn" class="cancel-btn cancel-info-btn">Cancelar</button>
                        </div>

                        <!-- Sección para cambiar la contraseña -->
                        <div class="change-password-section">
                            <h3>Cambiar Contraseña</h3>
                            <label for="currentPassword" class="label">Contraseña Actual:</label>
                            <input type="password" id="currentPassword" class="input-field" placeholder="Contraseña actual">

                            <label for="newPassword" class="label">Nueva Contraseña:</label>
                            <input type="password" id="newPassword" class="input-field" placeholder="Nueva contraseña">

                            <label for="confirmPassword" class="label">Confirmar Nueva Contraseña:</label>
                            <input type="password" id="confirmPassword" class="input-field" placeholder="Confirmar nueva contraseña">

                            <button id="savePasswordBtn" class="save-btn save-password-btn">Guardar Cambios</button>
                            <button id="cancelPasswordBtn" class="cancel-btn cancel-password-btn">Cancelar</button>
                        </div>

                        <!-- Sección para cambiar la imagen del perfil -->
                        <div id="profileImageSection" class="profile-image-section">
                            <h3>Cambiar Imagen de Perfil</h3>
                            <label for="profileImage" class="label">Seleccionar Imagen:</label>
                            <input type="file" id="profileImage" class="input-field" accept="image/*">

                            <div class="preview-container">
                                <img id="imagePreview" src="${userData.imagenPerfil}" alt="Vista Previa" class="image-preview">
                            </div>

                            <button id="saveProfileImageBtn" class="save-btn save-profile-image-btn">Guardar Cambios</button>
                            <button id="cancelProfileImageBtn" class="cancel-btn cancel-profile-image-btn">Cancelar</button>
                        </div>

                        <!-- Nueva sección para eliminar cuenta -->
                        <div class="delete-account-section">
                            <h3>Eliminar Cuenta</h3>
                            <p class="text-delete">
                            Con el fin de garantizar una eliminación completa y segura de su cuenta, le recomendamos a nuestros valiosos 
                            usuarios que inicien sesión nuevamente antes de proceder. Una vez iniciada sesión, su cuenta será eliminada 
                            por completo de nuestros servidores. Esta medida asegura una gestión efectiva y confiable de la eliminación de 
                            su cuenta. Apreciamos su confianza y agradecemos su comprensión en este proceso.
                            </p>
                            <button id="deleteAccountBtn" class="delete-btn">Eliminar Cuenta</button>
                        </div>
                    </div>
                `;
                loadPageContent(settingsContent);
                // Actualizar la imagen del menú
                updateMenuProfileImage(userData.imagenPerfil);

                // Manejar eventos de la sección de actualizar datos
                $("#saveInfoBtn").click(handleSaveInfo);
                $("#cancelInfoBtn").click(handleCancelInfo);

                // Manejar eventos de la sección de cambiar contraseña
                $("#savePasswordBtn").click(handleSavePassword);
                $("#cancelPasswordBtn").click(handleCancelPassword);

                // Manejar eventos de la sección de cambiar imagen de perfil
                $("#saveProfileImageBtn").click(handleSaveProfileImage);
                $("#cancelProfileImageBtn").click(handleCancelProfileImage);
            } else {
                console.log("No se encontraron datos del usuario en la base de datos");
            }
        }).catch(function (error) {
            console.log("Error al obtener datos del usuario: ", error);
        });

    }

    // Delegación de eventos para los botones en la página de Configuración
    $("#page-content").on("click", "#saveInfoBtn", handleSaveInfo);
    $("#page-content").on("click", "#cancelInfoBtn", handleCancelInfo);
    $("#page-content").on("click", "#savePasswordBtn", handleSavePassword);
    $("#page-content").on("click", "#cancelPasswordBtn", handleCancelPassword);

    function handleSaveInfo() {
        // Obtener los valores de los campos de entrada
        var newFirstName = $("#firstName").val();
        var newLastName = $("#lastName").val();
        var newPhone = $("#phone").val();

        // Actualizar los datos en la base de datos
        userRef.update({
            nombre: newFirstName,
            apellido: newLastName,
            telefono: newPhone
        }).then(() => {
            console.log('Datos actualizados en la base de datos');
            // Mostrar mensaje de éxito al usuario
            showPostCreationModal("successSection", "Datos actualizados con éxito");
        }).catch(error => {
            console.error('Error al actualizar datos en la base de datos:', error);
            // Mostrar mensaje de error al usuario
            showPostCreationModal("errorSection", "Error al actualizar datos");
        });
    }

    function handleCancelInfo() {
        // Puedes agregar lógica adicional si es necesario, como restablecer los campos
        console.log("Cancelar actualización de información");
    }

    function handleSavePassword() {
        // Obtener los valores de los campos de entrada
        var currentPassword = $("#currentPassword").val();
        var newPassword = $("#newPassword").val();
        var confirmPassword = $("#confirmPassword").val();

        // Validar que la nueva contraseña y la confirmación coincidan
        if (newPassword !== confirmPassword) {
            console.log("La nueva contraseña y la confirmación no coinciden");

            // Mostrar mensaje de error al usuario
            showPostCreationModal("errorSection", "La nueva contraseña y la confirmación no coinciden");
            return;
        }

        // Cambiar la contraseña en Firebase Authentication
        var user = firebase.auth().currentUser;

        var credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
        );

        user.reauthenticateWithCredential(credential)
            .then(() => {
                // La autenticación ha tenido éxito, ahora cambiar la contraseña
                return user.updatePassword(newPassword);
            })
            .then(() => {
                console.log('Contraseña actualizada con éxito');

                // Actualizar la contraseña en Firebase Realtime Database
                var userId = user.uid;
                var userRef = firebase.database().ref('usuarios/' + userId);
                userRef.update({ password: newPassword })
                    .then(() => {
                        console.log('Contraseña actualizada en la base de datos');

                        // Mostrar mensaje de éxito al usuario
                        showPostCreationModal("successSection", "Contraseña actualizada con éxito");
                    })
                    .catch(error => {
                        console.error('Error al actualizar la contraseña en la base de datos:', error);

                        // Mostrar mensaje de error al usuario
                        showPostCreationModal("errorSection", "Error al actualizar la contraseña");
                    });
            })
            .catch(error => {
                console.error('Error al actualizar la contraseña:', error);

                // Mostrar mensaje de error al usuario
                showPostCreationModal("errorSection", "Error al actualizar la contraseña");
            });
    }


    function handleCancelPassword() {
        // Puedes agregar lógica adicional si es necesario, como restablecer los campos
        console.log("Cancelar cambio de contraseña");
    }

    // Evento de cambio en el input de archivo para la imagen de perfil
    $("#profileImage").change(function (event) {
        var selectedImage = event.target.files[0];

        if (selectedImage) {
            // Crear referencia al sistema de archivos en Firebase Storage
            var storageRef = firebase.storage().ref();

            // Crear una referencia específica para la nueva imagen
            var userImgRef = storageRef.child(`usuarios/${userId}/ImgPerfil/${selectedImage.name}`);

            // Subir la imagen al sistema de archivos
            userImgRef.put(selectedImage)
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(downloadURL => userRef.update({ imagenPerfil: downloadURL }))
                .then(() => {
                    console.log('URL de la imagen actualizada en la base de datos');
                    // Recargar la página de configuración después de cambiar la imagen
                    loadSettingsPage();
                })
                .catch(error => console.error('Error al cambiar la imagen de perfil: ', error));
        } else {
            console.log("No se seleccionó ninguna imagen");
        }
    });

    // Manejar eventos de la sección de cambiar imagen de perfil
    $(document).on("click", "#saveProfileImageBtn", function () {
        console.log("Clic en el botón de guardar imagen de perfil");
        // Obtener el archivo seleccionado
        var selectedImage = $("#profileImage")[0].files[0];

        // Verificar si se seleccionó un archivo
        if (selectedImage) {
            // Desactivar el botón de guardar mientras se sube la imagen
            $(this).prop("disabled", true);

            // Mostrar un indicador de carga (puedes personalizar esto según tu interfaz)
            // Aquí puedes mostrar un spinner, un mensaje, etc.

            // Crear referencia al sistema de archivos en Firebase Storage
            var storageRef = firebase.storage().ref();

            // Crear una referencia específica para la nueva imagen
            var userImgRef = storageRef.child(`usuarios/${userId}/ImgPerfil/${selectedImage.name}`);

            // Subir la imagen al sistema de archivos
            userImgRef.put(selectedImage)
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(downloadURL => userRef.update({ imagenPerfil: downloadURL }))
                .then(() => {
                    console.log('URL de la imagen actualizada en la base de datos');
                    // Recargar la página de configuración después de cambiar la imagen
                    loadSettingsPage();
                })
                .catch(error => console.error('Error al cambiar la imagen de perfil: ', error))
                .finally(() => {
                    // Reactivar el botón de guardar después de completar el proceso
                    $("#saveProfileImageBtn").prop("disabled", false);
                    // Ocultar el indicador de carga o realizar cualquier otra acción necesaria
                });
        } else {
            // Mostrar un mensaje de error o realizar cualquier otra acción si no se seleccionó un archivo
            console.log("Por favor, selecciona una imagen antes de hacer clic en 'Guardar Cambios'.");
        }
    });

    function handleSaveProfileImage() {
        // Obtener el archivo seleccionado
        var selectedImage = $("#profileImage")[0].files[0];

        // Verificar si se seleccionó un archivo
        if (selectedImage) {
            // Desactivar el botón de guardar mientras se sube la imagen
            $("#saveProfileImageBtn").prop("disabled", true);

            // Mostrar un indicador de carga (puedes personalizar esto según tu interfaz)
            // Aquí puedes mostrar un spinner, un mensaje, etc.

            // Crear referencia al sistema de archivos en Firebase Storage
            var storageRef = firebase.storage().ref();

            // Crear una referencia específica para la nueva imagen
            var userImgRef = storageRef.child(`usuarios/${userId}/ImgPerfil/${selectedImage.name}`);

            // Subir la imagen al sistema de archivos
            userImgRef.put(selectedImage)
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(downloadURL => {
                    // Asegúrate de que userRef esté definido y sea un objeto antes de intentar llamar a update
                    if (userRef && typeof userRef.update === 'function') {
                        // Mostrar mensajes de registro para la depuración
                        console.log('URL de la imagen obtenida:', downloadURL);

                        // Intentar actualizar la URL de la imagen en la base de datos
                        userRef.update({ imagenPerfil: downloadURL })
                            .then(() => {
                                console.log('URL de la imagen actualizada en la base de datos');

                                // Mostrar mensaje de éxito al usuario
                                showPostCreationModal("successSection", "Imagen de perfil actualizada con éxito");

                                // Recargar la página de configuración después de cambiar la imagen
                                loadSettingsPage();
                                // Actualizar la imagen del menú
                                updateMenuProfileImage(downloadURL);
                                // Recargar la página actual
                                location.reload();
                            })
                            .catch(error => console.error('Error al cambiar la imagen de perfil (update): ', error))
                            .finally(() => {
                                // Reactivar el botón de guardar después de completar el proceso
                                $("#saveProfileImageBtn").prop("disabled", false);
                                // Ocultar el indicador de carga o realizar cualquier otra acción necesaria
                            });
                    } else {
                        // Mostrar mensaje de error si userRef no está definido correctamente
                        console.error('Error: userRef no está definido o no tiene un método update');
                    }
                })
                .catch(error => console.error('Error al obtener la URL de la imagen: ', error));
        } else {
            // Mostrar un mensaje de error o realizar cualquier otra acción si no se seleccionó un archivo
            console.log("Por favor, selecciona una imagen antes de hacer clic en 'Guardar Cambios'.");
        }
    }

    // Función para actualizar la imagen del menú
    function updateMenuProfileImage(imageURL) {
        // Actualizar la imagen del usuario en el menú
        $(".user-img img").attr("src", imageURL);
    }

    function handleCancelProfileImage() {
        // Lógica para cancelar la actualización de imagen de perfil
        console.log("Cancelar actualización de imagen de perfil");
    }

    $(document).on("click", "#deleteAccountBtn", function () {
        console.log("Botón de eliminar cuenta clickeado");
        $("#deleteAccountModal").fadeIn();
    });

    // Ocultar el modal al hacer clic en "Cancelar"
    $(document).on("click", "#cancelDeleteAccountBtn", function () {
        $("#deleteAccountModal").fadeOut();
    });

    // Función para eliminar el usuario de la base de datos en tiempo real
    function deleteUserData(userId) {
        var userRef = firebase.database().ref('usuarios/' + userId);
        return userRef.remove();
    }

    // Función para eliminar el contenido de la carpeta "posts"
    function deletePostsData(userId) {
        var postsRef = firebase.database().ref('posts/' + userId);
        return postsRef.remove();
    }

    // Función para eliminar la carpeta de imágenes de perfil y subcarpetas de Storage
    function deleteProfileImages(userId) {
        var storageRef = firebase.storage().ref();
        var userImgRef = storageRef.child(`usuarios/${userId}`);

        return userImgRef.listAll()
            .then((result) => {
                // Recorre todos los elementos y elimínalos
                var deletePromises = result.items.map(item => item.delete());

                // Si hay subcarpetas, elimina también esas subcarpetas
                result.prefixes.forEach(prefix => {
                    deletePromises.push(deleteFolder(prefix));
                });

                // Espera a que todas las operaciones de eliminación se completen
                return Promise.all(deletePromises);
            });
    }

    // Función auxiliar para eliminar una carpeta (usada para las subcarpetas)
    function deleteFolder(folderRef) {
        return folderRef.listAll()
            .then(result => {
                var deletePromises = result.items.map(item => item.delete());
                result.prefixes.forEach(prefix => {
                    deletePromises.push(deleteFolder(prefix));
                });
                return Promise.all(deletePromises);
            });
    }

    // Función para eliminar el contenido de la carpeta "posts"
    function deleteAccountStadistics(userId) {
        var stadisticsRef = firebase.database().ref('accountStatistics/' + userId);
        return stadisticsRef.remove();
    }

    // Función para cerrar la sesión
    function signOut() {
        return firebase.auth().signOut();
    }

    // Función para eliminar la cuenta de autenticación de Firebase
    function deleteUser(user) {
        return user.delete();
    }
    $(document).on("click", "#confirmDeleteAccountBtn", function () {
        console.log("Botón 'confirmDeleteAccount' clickeado");

        var user = firebase.auth().currentUser;
        var userId = user.uid;

        // Mostrar mensaje de carga al usuario
        showPostCreationModal("loadingSection", "Eliminando cuenta, por favor espera...");

        deletePostsData(userId)
            .then(() => {
                console.log('Contenido de "accountStatistics" eliminado');
                return deleteAccountStadistics(userId);  // Elimina el nodo "accountStatistics"
            })
            .then(() => {
                console.log('Contenido de "posts" eliminado');
                return deleteUserData(userId);  // Elimina el nodo "usuarios"
            })
            .then(() => {
                console.log('Usuario eliminado de la base de datos en tiempo real');
                return deleteProfileImages(userId);
            })
            .then(() => {
                console.log('Carpeta de imágenes de perfil y subcarpetas eliminada de Storage');
                return signOut();
            })
            .then(() => {
                console.log('Sesión cerrada correctamente');
                return deleteUser(user);
            })
            .then(() => {
                console.log('Cuenta eliminada correctamente');

                // Mostrar mensaje de éxito al usuario
                showPostCreationModal("successSection", "Cuenta eliminada correctamente");

                // Redirigir o realizar otras acciones después de la eliminación exitosa
                window.location.href = "../index.html";
                window.history.replaceState(null, null, "../index.html");
            })
            .catch(error => {
                console.error('Error al realizar alguna operación:', error);

                // Mostrar mensaje de error al usuario
                showPostCreationModal("errorSection", "Error al eliminar la cuenta. Por favor, inténtalo de nuevo más tarde.");

                // Puedes manejar el error aquí, por ejemplo, mostrando un mensaje al usuario
            });
    });

});
