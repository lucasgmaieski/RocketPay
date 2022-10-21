import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")
const inputs = document.querySelectorAll("input")

function setCardType(type) {
  const colors = {
    "visa": ["#436d99", "#2d57f2"],
    "mastercard": ["#df6f29", "#c69347"],
    "default": ["black", "gray"],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `public/cc-${type}.svg`)
}
setCardType("default");

const securityCode = document.querySelector('#security-code');
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1, 
      to: 12,
    },
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)


const cardNumber = document.querySelector('#card-number')
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:/^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    }) 
    console.log(foundMask)
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const cardHolder = document.querySelector("#card-holder")

function maskNome(value) {
  console.log(value)
  return value
    .replace(/\d/g, "")
    .replace(/\s{2,}/, " ")
    .replace(/[^a-z\s]/, "")
    .replace(/^\s/, "")
    .replace(/^(\D{1,2})\s/, "$1")
    .replace(/(\s\D{1})\s/, "$1")
}

cardHolder.addEventListener("input", (e) => {
  e.target.value = maskNome(e.target.value)
  updateCardHolder(e.target.value)
})
function updateCardHolder(holder) {
  const ccHolder = document.querySelector(".cc-holder .value")
  if (holder.length === 0) {
    ccHolder.innerText = "FULANO DA SILVA"
    borderCheck(cardHolder, false)
  }else {
    ccHolder.innerText = holder
    if (cardHolder.value.length > 2) {
      borderCheck(cardHolder, true)
    } else { cardHolder.classList.remove("check") }
  }
}

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})
function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  if(code.length === 0) {
    ccSecurity.innerText = "123"
    borderCheck(securityCode, false)
  } else {
    ccSecurity.innerText = code
    if(code.length === 4) {
      borderCheck(securityCode, true)
    } else { securityCode.classList.remove("check") }
  }
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})
function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  if(number.length === 0){
    ccNumber.innerText = "1234 5678 9012 3456"
    borderCheck(cardNumber, false)
  } else {
    ccNumber.innerText = number
    if(number.length === 19) {
      borderCheck(cardNumber, true)
    }else { cardNumber.classList.remove("check") }
  }
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value) 
})
function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date

  if (date.length === 0) {
    ccExpiration.innerText = "02/32"
    borderCheck(expirationDate, false)
  } else {
    ccExpiration.innerText = date
    if (date.length === 5) {
      borderCheck(expirationDate, true)
    } else { expirationDate.classList.remove("check") }
  }
}

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", (e) => {
  let resultado = checkInputs()
  if (resultado != 0) {
    e.preventDefault()
    console.log(cardNumber.value.length)
    alert("Preencha corretamente os campos sinalizados em vermelho!")
  } else {
    document.querySelector("form").reset()
    alert("Cartão adicionado com sucesso")
    inputs.forEach(function (item) {
      item.classList.remove("check")
    })
  }
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

function checkInputs() {
  if (cardNumber.value.length === 19 && securityCode.value.length === 4 && cardHolder.value.length > 2 && expirationDate.value.length === 5) {
    return 0
  } else {
    inputs.forEach(function (item) {
      if (!item.classList.contains("check")){
        item.classList.add("nocheck")
      }
    })
    return 1
  }
}

function borderCheck(object, i) {
  if (i) {
    object.classList.add("check")
    object.classList.remove("nocheck")
  } else {
    object.classList.add("nocheck")
    object.classList.remove("check")
  }
}