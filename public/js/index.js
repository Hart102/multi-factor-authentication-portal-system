const elementSelector = element => document.querySelector(element)

const popUp = elementSelector('.popUp')
const closingTab = elementSelector('.closing-tab')

const signUp = elementSelector('.sign-up')
const login = elementSelector('.login')
const recoverPasswordForm = elementSelector('.recover-password')

const mobileMenu = elementSelector('.mobile-menu')
const pages = document.querySelectorAll('#pages')


//--------- Hamburger menu function ---------
const hamburger = () => {
    mobileMenu.classList.toggle('sm:hidden')
    elementSelector('.fa-bars').classList.toggle('fa-times')
}

//------------- Display login form -------------
const displayLogin = () => {
    popUp.classList.remove('hidden')
    signUp.setAttribute('class', 'sign-up flex flex-col space-y-3 w-full p-6 text-center bg-transparent absolute top-7 -left-[100%]')
    login.setAttribute('class', 'login flex flex-col space-y-3 w-full bg-white p-6 text-center bg-transparent absolute -right-[100%]  top-10 -right-[0%]')
    recoverPasswordForm.classList.add('-right-[100%]')

    signUp.style.transition = '0.3s'
    login.style.transition = '0.3s'
}

//------------- Display sign up form -------------
const displaySignUp = () => {
    login.classList.add('right-[-100%]')
    signUp.classList.add('-left-[0%]')
    
    signUp.style.transition = '0.3s'
    login.style.transition = '0.3s'
    popUp.classList.remove('hidden')
}

// Display recover password form 
const displayRecoverPass = () => {
    login.style.transition = '0.3s'
    recoverPasswordForm.style.transition = '0.3s'

    login.classList.add('-left-[100%]')
    recoverPasswordForm.classList.remove('-right-[100%]')
}

//----------- Close pop up -----------
const closePopUp = () => {
    popUp.classList.add('hidden')
}


// Pigination 
let currentPage = ''
const pageContainer = []

//--------- Naxt page functionality ---------
const nextBtn = () => {
    pages.forEach((page, indx) => pageContainer.push(page))
                
    pageContainer[0].setAttribute('class', 'absolute top-[30%] -left-[100%] bg-lightAsh')
    
    pageContainer[1].style.transition = '0.3s'
    pageContainer[1].setAttribute('class', 'mx-auto flex align-center justify-between absolute top-[15%] -right-[0rem] bg-lightAsh')
}

//------- Previous page functionality -------
const previous = () => {
    pageContainer[0].classList.remove('-left-[100%]')
    pageContainer[1].setAttribute('class', 'bg-lightAsh mx-auto flex align-center justify-between absolute top-[15%] -right-[70rem]')
}



// Recover password function 
$('.recover-btn').click(e => { //verify otp route
    e.preventDefault()

    $.ajax({
        url: '/recover/password',
        type: 'post',
        data: ({
            email: $('.recover-input').val(),
        }),
        error: (error) => {
            $('.error').html(error);
        }

    }).done(response => {
        $('.error').html(response);
    })
})
