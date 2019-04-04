'use strict';

$(function () {

    const $entrySubmitBtn = $('#entry-submit');
    const $entryPhoto = $('#entry-photo');
    const $outSubmitBtn = $('#out-submit');
    const $outPhoto = $('#out-photo');
    
    bindEvent($entrySubmitBtn, $entryPhoto);
    bindEvent($outSubmitBtn, $outPhoto);
    
    function bindEvent($submitButton, $photoInput) {
    
        $submitButton.on('click', function (e) {
    
            e.preventDefault();
    
            uploadPhoto($photoInput);
        });
    }
    
    function uploadPhoto($photoInput) {

        const file = $photoInput.get(0).files.item(0);
        const body = new FormData();
        body.append('thumbnail', file, file.name);
    
        $.ajax({
            method: 'POST',
            url: '/gate',
            data: body,
            processData: false,
            contentType: false
        })
            .done(function (response) {
    
                console.log(response);
            })
            .fail(console.error);
    }
});