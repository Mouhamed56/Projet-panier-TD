document.addEventListener("DOMContentLoaded", function () {

let plusBtns = document.querySelectorAll(".plus");
let minusBtns = document.querySelectorAll(".minus");
let deleteBtns = document.querySelectorAll(".remove-btn");
let likeBtns = document.querySelectorAll(".like-btn");
let total = document.getElementById("total-price");


function updateTotal(){

 let items = document.querySelectorAll(".cart-item");
 let sum = 0;

 items.forEach(function(item){

  let price = item.dataset.price;
  let quantity = item.querySelector(".quantity").textContent;

  sum += price * quantity;

 });

 total.textContent = sum + " €";

}



plusBtns.forEach(function(btn){

 btn.addEventListener("click", function(){

  let q = btn.parentElement.querySelector(".quantity");

  q.textContent++;

  updateTotal();

 });

});



minusBtns.forEach(function(btn){

 btn.addEventListener("click", function(){

  let q = btn.parentElement.querySelector(".quantity");

  if(q.textContent > 0){

   q.textContent--;

  }

  updateTotal();

 });

});



deleteBtns.forEach(function(btn){

 btn.addEventListener("click", function(){

  btn.parentElement.remove();

  updateTotal();

 });

});



likeBtns.forEach(function(btn){

 btn.addEventListener("click", function(){

  btn.classList.toggle("liked");

 });

});


updateTotal();

});