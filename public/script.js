const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

if(bar){
    bar.addEventListener('click', ()=>{
        nav.classList.add('active');
    })
}
if(close){
    close.addEventListener('click', ()=>{
        nav.classList.remove('active');
    })
}



var taxRate = 0.05;
var shippingRate = 15.00; 
var fadeTime = 300;


/* Assign actions */
$('.product-quantity input').change( function() {
  updateQuantity(this);
});

$('.product-removal button').click( function() {
  removeItem(this);
});

function code(){
var code = document.getElementById('coupencode').value;
if(code=='ankurtiwari'){
  swal("Coupen applied successfully !!");
  return 10;
}
else if(code!='ankurtiwari' && code!=''){
  swal("Invalid Coupen Code !!");
  return 0;
}
else{
  return 0;
}
}


function order(){
  swal({
title: "Success",
text: "You order has been successfully placed !",
icon: "success",
button: "Continue Shopping",
});
}

/* Recalculate cart */
function recalculateCart()
{
  var subtotal = 0;
  
  /* Sum up row totals */
  $('.product').each(function () {
    subtotal += parseFloat($(this).children('.product-line-price').text());
  });

}

function total(){
setTimeout(function() { 
  var itemPrice=document.querySelectorAll('.product-line-price');
  var sum=0;
  for(var i=0;i<itemPrice.length;i++)
  sum = Number(sum) + Number(itemPrice[i].textContent);
  var tax=(sum*18)/100;
  var total=0;
  var discount = (sum*code())/100;
  total=Number(sum)+Number(tax.toFixed(2))-Number(discount);
  document.getElementById('cart-subtotal').textContent=sum.toFixed(2);
  document.getElementById('cart-tax').textContent=tax;
  document.getElementById('cart-discount').textContent=discount;
  document.getElementById('cart-total').textContent=total.toFixed(0);
}, 500);
}

/* Update quantity */
function updateQuantity(quantityInput)
{
  /* Calculate line price */
  var productRow = $(quantityInput).parent().parent();
  var price = parseFloat(productRow.children('.product-price').text());
  var quantity = $(quantityInput).val();
  var linePrice = price * quantity;
  
  /* Update line price display and recalc cart totals */
  productRow.children('.product-line-price').each(function () {
    $(this).fadeOut(fadeTime, function() {
      $(this).text(linePrice.toFixed(2));
      recalculateCart();
      $(this).fadeIn(fadeTime);
    });
  });  
}


/* Remove item from cart */
function removeItem(removeButton)
{
  /* Remove row from DOM and recalc cart total */
  var productRow = $(removeButton).parent().parent();
  productRow.slideUp(fadeTime, function() {
    productRow.remove();
    recalculateCart();
  });
} 


window.onload = function () {
  total();
  document.getElementById("loading").remove()
//   document.querySelector(".content").removeAttribute("hidden")
}


function newsletter(){
  swal("Subscribed to newletter");
}