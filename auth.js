import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc
} from "./firebase.js";

const registroForm =
  document.getElementById("registro-form");

if (registroForm) {

  registroForm.addEventListener("submit",
  async (e) => {

    e.preventDefault();

    const nombre =
      document.getElementById("nombre").value;

    const empresa =
      document.getElementById("empresa").value;

    const celular =
      document.getElementById("celular").value;

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
        empresa,
        celular,
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