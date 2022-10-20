// import "./css/index.css"
// import IMask from "imask";


const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

console.log(ccBgColor01);


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

setCardType("mastercard");

// security code
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