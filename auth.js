import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const registroForm =
  document.getElementById("registro-form");

if (registroForm) {

  registroForm.addEventListener("submit",
  async (e) => {

    e.preventDefault();

    const nombre =
      document.getElementById("nombre").value;

    const direccion =
      document.getElementById("direccion").value;

    const cumple =
      document.getElementById("cumple").value;

    const telefono =
      document.getElementById("telefono").value;

    const email =
      document.getElementById("email").value;

    const password =
      document.getElementById("password").value;

    try {

      const credenciales =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const usuario = credenciales.user;

      await setDoc(doc(db, "usuarios", usuario.uid), {

        nombre,
        direccion,
        cumple,
        telefono,
        email,

        puntos: 0,

        creado:
          new Date().toISOString()

      });

      alert("Registro exitoso 😎");

      window.location.href =
        "login.html";

    } catch (error) {

      alert(error.message);

    }

  });

}

const loginForm =
  document.getElementById("login-form");

if (loginForm) {

  loginForm.addEventListener("submit",
  async (e) => {

    e.preventDefault();

    const email =
      document.getElementById("login-email").value;

    const password =
      document.getElementById("login-password").value;

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Ingreso correcto 😎");

      window.location.href =
        "fixture.html";

    } catch (error) {

      alert("Correo o contraseña incorrectos");

    }

  });

}