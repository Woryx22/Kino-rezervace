document.addEventListener("DOMContentLoaded", function () {
  const seatsContainer = document.getElementById("seatsContainer");
  const selectedSeatsElement = document.getElementById("selectedSeats");
  const confirmButton = document.getElementById("confirmButton");
  const closeButton = document.getElementById("close-window");
  const confirmReservationButton = document.getElementById("confirmReservation");
  const reservationInfoDiv = document.getElementById("reservationInfo");
  const filmNameDiv = document.getElementById("filmName");

  let selectedSeats = 0;

  var idf = sessionStorage.getItem("idFilmu")
  var cena = sessionStorage.getItem("cena")
  var nf = sessionStorage.getItem("nazevFilmu")

  const filmIdentifier = idf;

  // Načtení stavu sedadel z local storage při načtení stránky
  let confirmedSeatsStorage = JSON.parse(localStorage.getItem(`confirmedSeats_${filmIdentifier}`)) || [];
  displayConfirmedSeats(confirmedSeatsStorage);

  // Načtení rezervací z local storage při načtení stránky
  let reservations = JSON.parse(localStorage.getItem(`reservations_${filmIdentifier}`)) || [];
  displayReservations(reservations);

  const aaaa = `<div>Film: ${nf}</div>`;
  filmNameDiv.insertAdjacentHTML("beforeEnd", aaaa);

  for (let row = 1; row <= 8; row++) {
    for (let seatNum = 1; seatNum <= 16; seatNum++) {
      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.setAttribute("data-row", row);
      seat.setAttribute("data-seat", seatNum);
      seat.textContent = `${row}-${seatNum}`;
      seatsContainer.appendChild(seat);

      if (confirmedSeatsStorage.includes(`${row}-${seatNum}`)) {
        seat.classList.add("confirmed");
        seat.removeEventListener("click", toggleSeat);
      } else {
        seat.addEventListener("click", toggleSeat);
      }
    }
  }

  confirmButton.addEventListener("click", confirmSelection);
  closeButton.addEventListener("click", closePopup);
  confirmReservationButton.addEventListener("click", confirmReservation);

  function toggleSeat() {
    if (this.classList.contains("confirmed")) return;
    this.classList.toggle("selected");
    updateSelectedSeats();
  }

  function updateSelectedSeats() {
    const selectedSeatsArray = document.querySelectorAll(".seat.selected");
    selectedSeats = selectedSeatsArray.length;
    selectedSeatsElement.textContent = `Počet vybraných sedadel: ${selectedSeats} Cena celkem: ${selectedSeats * cena}`;
  }


  function confirmSelection() {
    const selectedSeatsArray = document.querySelectorAll(".seat.selected");
    if (selectedSeatsArray.length > 0)
      document.getElementById("fade-wrapper").style.display = "block";
    else
      alert("Vyberte sedadla pro rezervaci")
  }

  function closePopup() {
    document.getElementById("fade-wrapper").style.display = "none";
  }

  // Uložení potvrzených sedadel do local storage
  function saveConfirmedSeats() {
    const confirmedSeatsArray = document.querySelectorAll(".seat.confirmed");
    const confirmedSeatsList = Array.from(confirmedSeatsArray).map(seat => seat.textContent);
    localStorage.setItem(`confirmedSeats_${filmIdentifier}`, JSON.stringify(confirmedSeatsList));
  }

  function confirmReservation() {
    const firstName = document.getElementById("fname").value;
    const lastName = document.getElementById("lname").value;
    const email = document.getElementById("email").value;

    if (firstName != "" && lastName != "" && email != "") {
      const selectedSeatsArray = document.querySelectorAll(".seat.selected");
      selectedSeatsArray.forEach(seat => {
        seat.classList.remove("selected");
        seat.classList.add("confirmed");
      });
      updateSelectedSeats();
      saveConfirmedSeats();

      selectedSeats = selectedSeatsArray.length;

      const price = cena * selectedSeats;

      const currentDate = new Date().toLocaleString();

      const reservationData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        seats: Array.from(selectedSeatsArray).map(seat => seat.textContent),
        dateTime: currentDate,
        price: price
      };

      reservations.push(reservationData); // Přidání rezervace do seznamu
      localStorage.setItem(`reservations_${filmIdentifier}`, JSON.stringify(reservations)); // Uložení rezervací do local storage s id filmu

      displayReservation(reservationData);

      closePopup();
    }
    else {
      // console.log("chybka");
      alert("Vyplňte prosím potřebné údaje")
    }

  }

  // Funkce pro zobrazení potvrzených sedadel při načtení stránky
  function displayConfirmedSeats(confirmedSeats) {
    confirmedSeats.forEach(seat => {
      const seatElement = document.querySelector(`.seat[data-seat="${seat}"]`);
      if (seatElement) {
        seatElement.classList.add("confirmed");
        seatElement.removeEventListener("click", toggleSeat);
      }
    });
  }

  // Funkce pro zobrazení rezervací při načtení stránky
  function displayReservations(reservations) {
    reservations.forEach(reservationData => {
      displayReservation(reservationData);
    });
  }

  function displayReservation(reservationData) {
    const reservationHTML = `
      <div class="vypisRezervace">
        <span>Jméno a přijímení: ${reservationData.firstName} ${reservationData.lastName}</span>
        <span>Email: ${reservationData.email}</span>
        <span>Rezervovaná sedadla: ${reservationData.seats.join(", ")}</span>
        <span>Čas rezervace: ${reservationData.dateTime}</span>
        <span>Cena celkem: ${reservationData.price}</span>`;
    reservationInfoDiv.insertAdjacentHTML("beforeend", reservationHTML);
  }
});
