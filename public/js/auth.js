$(document).ready(() => {
    // Single element selector 
    const elementSelector = element => $(element)
    const multiSelector = element => document.querySelectorAll(element)
    let errMsg = elementSelector('.error')

    //--- Sign up properties ---
    let phone = elementSelector('#phone')
    let email = elementSelector('#email')
    let password = elementSelector('#password')

    //--- Sign up function ---
    $('.sign-up').submit(e => {
        e.preventDefault()
        $.ajax({
            url: '/',
            type: 'post',
            data: ({
                phone: phone.val(),
                email: email.val(),
                password: password.val()
            }),
            error: (error) => {
                errMsg.html('Something went wrong please try again.')
            }

        }).done(response => {
            if (response == 'true') {
                displayLogin()
                localStorage.setItem("phone", password.val())

            }else{
                errMsg.html(response)
            }
        })
    })


    //--- Login function ---
    let Password = elementSelector('.Password')

    $('.login').submit(e => {
        e.preventDefault()
        $.ajax({
            url: '/login',
            type: 'post',
            data: ({
                password: Password.val()
            }),
            error: (error) => {
                errMsg.html('Something went wrong please try again.')
            }

        }).done(response => {
            if (response == 'true') {
                localStorage.setItem("phone", Password.val())
                location.href = './verificationPg.html'

            }else{
                errMsg.html(response)
            }
        })

    })

    // Clear errorMsg while typing 
    multiSelector('input').forEach(ele => {
        ele.addEventListener('keyup', () => {
            errMsg.html('')
        })
    })


})