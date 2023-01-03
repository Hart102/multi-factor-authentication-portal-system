$(document).ready(() => {
    let errMsg = $(".error")

    const update = () => {
        let select = document.getElementById('method');
        let option = select.options[select.selectedIndex].value;
        return option
    }
    userData = localStorage.getItem("phone") // Getting user info from the local Storage

    $('#getCode').click(e => { //Send otp route
        e.preventDefault()
        $.ajax({
            url: '/verify/user',
            type: 'post',
            data: ({
                method: update(),
                userData,
            }),
            error: (error) => {
                errMsg.html(error);
            }

        }).done(response => {
            if (response.err) {
                errMsg.html(response.err);
                
            }else{
                errMsg.html(response)
            }
        })
    })

    $('#verifyOtp').click(e => { //verify otp route
        e.preventDefault()

        $.ajax({
            url: '/verifyOtp',
            type: 'post',
            data: ({
                code: $('#otp').val(),
                userData
            }),
            error: (error) => {
                errMsg.html(error);
            }

        }).done(response => {
            if (response == 'true') {
                location.href = '/dashborad.html'
                errMsg.html('')
            }else{
                errMsg.html(response)
            }
        })
    })


    // Clear errMsg when user is typing 
    $('#otp').keydown(() => {
        errMsg.html('')
    })
})