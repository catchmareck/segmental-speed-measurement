'use strict';

$(function () {

    const $entrySubmitBtn = $('#entry-submit');
    const $entryPhoto = $('#entry-photo');
    const $entryPreview = $('#entry-preview');
    const $outSubmitBtn = $('#out-submit');
    const $outPhoto = $('#out-photo');
    const $outPreview = $('#out-preview');
    
    bindEvent($entrySubmitBtn, $entryPhoto, $entryPreview);
    bindEvent($outSubmitBtn, $outPhoto, $outPreview);
    
    function bindEvent($submitButton, $photoInput, $photoPreview) {
    
        $submitButton.on('click', function (e) {
    
            e.preventDefault();
    
            $submitButton.attr('disabled', 'disabled');
            uploadPhoto($photoInput);
        });
        
        $photoInput.on('change', function (e) {

            const reader = new FileReader();
            reader.onload = function () {

                $photoPreview.attr('src', reader.result);
            };
            reader.readAsDataURL(e.target.files.item(0));
        })
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
            .done(function () {

                $entrySubmitBtn.removeAttr('disabled', 'disabled');
                $outSubmitBtn.removeAttr('disabled', 'disabled');
            })
            .fail(console.error);
    }
});