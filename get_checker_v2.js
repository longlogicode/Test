$(document).ready(function () {
    var initAgeChecker = new GetChecker.Config.GetCheckerViewModel();
    initAgeChecker.init();
});

var GetChecker = GetChecker || {};
GetChecker.Config = {};
(function () {
    var NameSpace = GetChecker.Config;
    NameSpace.GetCheckerViewModel = function () {
        var self = this;
        var checkAddress = false;
        var checkPhotoId = false;

        self.init = function () {
            $(".cart").submit(function (event) {
                return true;
            });
            var htmlCheckInfo = InitHtml();
            var htmlCss = InitStyleCss();
            $("body").append(htmlCheckInfo);
            $("body").append(htmlCss);
            $(".cart").append("<input type='hidden' value='' name='checkout' id='checkoutBtnId' />");

            $("#gc-button-continue-step0").click(function () {
                $("#gc-step0").css("display", "none");
                $("#gc-step1").css("display", "block");
            });

            $(AgeCheckerConfig.element).click(function (event) {
                event.preventDefault();
                var user = GetCookie("get_checker_cookie");
                if (user != "") {
                    alert("Welcome again " + user + " you are ready to order.");
                    $(".cart").submit();
                }
                else {
                    $('#getchecker-modal').css('display', "block");
                }
            });

            $("input:file").on('change', function () {
                $("#btnCheckPhoto").css("display", "inline-block");
                $("#gc-upload-label").text("Upload Another Photo").attr("class", "gc-link-button");
                var image = this.files[0];
                $("#photo-id").attr("src", window.URL.createObjectURL(image));
                $("#gc-img-preview").css("display", "block");
            });

            $("#btnCheckPhoto").click(function () {
                $("#gc-step3").css("display", "none");
                $("#gc-step4").css("display", "block");
            });

            $("#close").click(function () {
                $("#getchecker-modal").css("display", "none")
            });

            EventButtonCheckAddress();
            EventButtonCheckPhoto();
            GetCitiesInfo();
        };
    };

    var InitHtml = function () {
        var html = `<div id="getchecker-modal" class="loaded" style="opacity: 1;display: none;">
            <span id='close'>close</span>
            <div  id="getchecker">
                <div class="gc-header">
                    <span class="gc-title">Get Checker</span>
                    <span class="gc-pow">Powered by Kolabs.co</span>
                    <hr>
                </div>
                <div class="gc-body">
                    <div><span style="font-size: 2em; color:#fff; padding-top:10px">Age Verification</span></div>
                    <div id="gc-step0" style="display: block">
                        <div class="gc-p">
                            <span>We must verify your age before you order</span>
                        </div>
                        <div class="gc-ct">
                            <span>
                                Due to new FDA and state regulations we must verify your age before you order.
                                We can verify most customers from the information you already entered into this page. If we cannot verify you automatically,
                                you will be required to submit a photo ID. Your information will be sent securely and will only used to verify your age.
                            </span>
                        </div>
                        <div class="gc-button-continue" id="gc-button-continue-step0">
                            <span>Continue</span><i class="fa fa-chevron-right"></i>
                        </div>
                    </div>
                    <div id="gc-step1" style="display: none">
                        <div class="gc-p">
                            <span>Please enter your personal information.</span>
                        </div>
                        <div class="gc-ct">
                            <span> This information will be used to verify your identity.</span>
                        </div>
                        <div class="gc-container">
                            <div id="gc-input-names" class="gc-ic">
                                <div class="gc-input">
                                    <div class="gc-label">First Name:</div><input type="text" id="gc-field-first_name" name="first_name" placeholder="John" class="gc-in">
                                </div>
                                <div class="gc-input"><div class="gc-label">Last Name:</div><input type="text" id="gc-field-last_name" name="last_name" placeholder="Doe" class="gc-in"></div>
                                <div class="gc-help">Enter your legal name as it appears on your ID. Do not include titles or nicknames.</div>
                            </div>
                            <div class="gc-ic">
                                <div class="gc-input">
                                    <div class="gc-label">Street Address:</div><input type="text" id="gc-field-address" name="address" placeholder="123 Main St" class="gc-in">
                                </div>
                                <div class="gc-help">Enter the first line of your home address.</div>
                            </div>
                            <div class="gc-ic">
                                <div class="gc-input">
                                    <div class="gc-label">City:</div><input type="text" id="gc-field-city" name="city" class="gc-in">
                                </div>
                                <div class="gc-input"><div class="gc-label">ZIP / Postal Code:</div><input type="text" id="gc-field-zip" name="zip" placeholder="12345" class="gc-in"></div>
                            </div>
                            <div class="gc-button-continue" id="gc-button-continue-step1">
                                <span>Continue</span><i class="fa fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                    <div id="gc-step2" class="gc-step" style="display: none;">
                        <div class="gc-h3">Verifying...</div>
                        <div class="gc-p">Please wait while we verify the information you submitted.</div>
                        <i id="gc-loading" class ="fa fa-spinner fa-spin fa-5x gc-icon"></i>
                    </div>
                    <div id="gc-step3" class="gc-step" style="display: none;">
                        <div class="gc-h3">Take a picture of your photo ID.</div>
                        <div class="gc-p">Your name and date of birth must be clearly visible.</div>
                        <form id="checkPhotoId" action="#" enctype="multipart/form-data">
                            <div>
                                <button class ="gc-button-continue" type="submit" id="btnCheckPhoto" style="display:none"><span>Continues</span><i class="fa fa-chevron-right"></i></button>
                            </div>
                            <div id="gc-img-preview" class ="gc-preview" style="display: none;"><img id="photo-id" /></div>
                            <div>
                                <input type="file" name="myfile" id="gc-id" accept="image/jpeg, image/png" class="gc-file">
                                <label for="gc-id" id="gc-upload-label" class="gc-button-continue" style="font-weight:normal">Upload Your ID</label>
                            </div>
                        </form>
                    </div>
                    <div id="gc-step4" class="gc-step" style="display: none;">
                        <div class="gc-h3">Verifying...</div>
                        <div class="gc-p">Please wait while we verify the information you submitted.</div>
                        <i id="gc-loading" class ="fa fa-spinner fa-spin fa-5x gc-icon"></i>
                    </div>
                    <div id="gc-step5" class="gc-step" style="display: none;">
                        <div class="gc-h3">Verified success</div>
                        <i id="gc-loading" class ="fa fa-spinner fa-spin fa-5x gc-icon"></i>
                    </div>
                </div>
                <div class="gc-footer">
                    <hr>
                </div>
            </div>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.js"></script>
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" />`;

        return html;
    },

    InitStyleCss = function () {
        var html = `<style>
                    #close {
                        float:right;
                        display:inline-block;
                        padding:2px 5px;
                        margin-right: 10px;
                        margin-top: 10px;
                        cursor: pointer;
                        color: #fff;
                        opacity: 1;
                     }
                    .gc-link-button {
                        color: #e4e3e8;
                        padding: 18px;
                        cursor: pointer;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                        -webkit-tap-highlight-color: rgba(255,255,255,0);
                        margin: 0 auto;
                        font-size: 1.2em;
                    }

                    .gc-button-continue i.fa {
                        margin-left: .5em;
                        position: relative;
                        top: 1px;
                    }
                    .gc-preview {
                        height: 280px;
                        width: 500px;
                        margin-top: 20px;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    #gc-img-preview img {
                        height: 100%;
                        width: 100%;
                    }
                    .gc-icon {
                        color: #fff;
                        margin-top: 30px
                    }
                    .gc-file {
                        width: .1px;
                        height: .1px;
                        opacity: 0;
                        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
                        filter: alpha(opacity=0);
                        overflow: auto;
                        position: absolute;
                        z-index: -1;
                    }

                    .gc-h3 {
                        font-size: 1.5em;
                        margin-bottom: .3em;
                        color: #fff;
                    }

                    .gc-container {
                        z-index: 2147483647;
                        min-height: 100%;
                        position: relative;
                        text-align: center;
                        max-width: 900px;
                        padding: 10px;
                        margin: 0 auto;
                        font-size: 16px;
                        color: #fff;
                        box-sizing: border-box;
                    }

                    .gc-input #gc-field-address {
                        width: 20em;
                    }

                    .gc-input {
                        display: inline-block;
                    }

                    .gc-input input.gc-in {
                        font-size: 16px!important;
                        font-style: normal!important;
                        display: inline-block;
                        outline: 0;
                        border-radius: 4px;
                        padding: .2em .5em!important;
                        border: 2px solid #c6d2e5!important;
                        background-color: transparent!important;
                        color: #fff!important;
                        width: 11em;
                        -webkit-transition: border-color .15s ease-in-out;
                        transition: border-color .15s ease-in-out;
                        box-sizing: border-box;
                        margin: 0px;
                    }

                    .gc-ic .gc-help {
                        font-size: .9em;
                        margin-top: .5em;
                        font-style: italic;
                        color: #c6d2e5;
                        margin-left: 166px;
                    }

                    .gc-input .gc-label {
                        display: inline-block;
                        margin-right: 16px;
                        color: #fff;
                        text-align: right;
                        min-width: 150px;
                    }

                    .gc-ic {
                        text-align: left;
                        margin: 1em auto;
                    }

                    .gc-button-continue {
	                    -moz-box-shadow: 0px 10px 14px -7px #272926;
	                    -webkit-box-shadow: 0px 10px 14px -7px #272926;
	                    box-shadow: 0px 10px 14px -7px #272926;
	                    background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #20ac07), color-stop(1, #20ac07));
	                    background:-moz-linear-gradient(top, #20ac07 5%, #20ac07 100%);
	                    background:-webkit-linear-gradient(top, #20ac07 5%, #20ac07 100%);
	                    background:-o-linear-gradient(top, #20ac07 5%, #20ac07 100%);
	                    background:-ms-linear-gradient(top, #20ac07 5%, #20ac07 100%);
	                    background:linear-gradient(to bottom, #20ac07 5%, #20ac07 100%);
	                    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#20ac07', endColorstr='#20ac07',GradientType=0);
	                    background-color:#20ac07;
	                    -moz-border-radius:4px;
	                    -webkit-border-radius:4px;
	                    border-radius:4px;
	                    border:1px solid #4b8f29;
	                    display:inline-block;
	                    cursor:pointer;
	                    color:#ffffff;
	                    font-family:Arial;
	                    font-size:19px;
	                    padding:12px 76px;
	                    text-decoration:none;
                        margin-top: 20px;
                    }
                    .gc-button-continue:hover {
	                    background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #20ac07), color-stop(1, #20ac07));
	                    background:-moz-linear-gradient(top, #20ac07 5%, #20ac07 100%);
	                    background:-webkit-linear-gradient(top, #20ac07 5%, #20ac07 100%);
	                    background:-o-linear-gradient(top, #20ac07 5%, #20ac07 100%);
	                    background:-ms-linear-gradient(top, #20ac07 5%, #20ac07 100%);
	                    background:linear-gradient(to bottom, #20ac07 5%, #20ac07 100%);
	                    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#20ac07', endColorstr='#20ac07',GradientType=0);
	                    background-color:#20ac07;
                    }
                    .gc-button-continue:active {
	                    position:relative;
	                    top:1px;
                    }

                     #getchecker .gc-pow {
                        color: #c6d2e5!important;
                        text-decoration: none;
                        font-size: 1em;
                    }

                    #getchecker .gc-p {
                        color: #fff;
                        font-size: 1.5em;
                    }

                    .gc-body {
                        text-align:center;
                        min-height: 75%;
                        margin-bottom: 10px;
                    }

                    .gc-footer {
                        padding-bottom: 30px;
                        bottom: 0;
                        min-height: 10%;
                    }

                    #getchecker hr {
                        margin-top: 0px;
                        margin-bottom: 0px;
                        border: 0;
                        border-top: 1px solid #eeeeee;
                    }

                    .gc-header {
                        padding-top:5px;
                        padding-bottom:5px;
                        min-height: 70px;
                    }
    
                    #getchecker-modal .gc-title {
                        font-size: 2em;
                        color: #ffffff;
                        margin-bottom: .1em;
                        padding-left:10px;
                    }

                    #getchecker-modal .gc-ct {
                        color: #c6d2e5!important;
                        text-decoration: none;
                        font-size: 1.2em;
                        margin-left: 110px;
                        margin-right: 110px;
                    }

                    #getchecker {
                        width: 80%;
                        height: 100%;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    #getchecker-modal {
                        position: fixed;
                        z-index: 2147483646;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        overflow: auto;
                        background: rgba(49,57,70,.95);

                    }

            .ui-autocomplete {
                position: absolute;
                z-index: 2147483647 !important;
                cursor: default;
                padding: 0;
                margin-top: 2px;
                list-style: none;
                background-color: #ffffff;
                border: 1px solid #ccc
                -webkit-border-radius: 5px;
                -moz-border-radius: 5px;
                border-radius: 5px;
                -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                -moz-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
            }
            .ui-autocomplete > li {
                padding: 3px 20px;
            }
            .ui-autocomplete > li.ui-state-focus {
                background-color: #DDD;
            }
            .ui-helper-hidden-accessible {
                display: none;
            }
            </style>`;
        return html;
    },

    EventButtonCheckAddress = function () {
        $("#gc-button-continue-step1").click(function () {
            var isValidate = true;
            var firstName = $("#gc-field-first_name").val().trim();
            var lastName = $("#gc-field-last_name").val().trim();
            var name = (firstName + " " + lastName).trim();
            var street_line = $("#gc-field-address").val().trim();
            var postal_code = $("#gc-field-zip").val().trim();
            var address = $("#gc-field-city").val().trim();

            var addressArr = address.split(",");
            var city = "";
            var state_code = "";
            if (addressArr.length >= 2) {
                city = addressArr[0];
                state_code = addressArr[1];
            }
            else if (address !== null) {
                city = address
            }

            if (name === null || name.length === 0) {
                alert("Name is required!");
                isValidate = false;
            }
            if (street_line === null || street_line.length === 0) {
                alert("Address is required!");
                isValidate = false;
            }
            if (address === null || address.length === 0) {
                alert("City is required!");
                isValidate = false;
            }

            if (postal_code === null || postal_code.length === 0) {
                alert("Postal Code is required!");
                isValidate = false;
            }

            if (isValidate) {
                var param = new Object;
                param.name = name;
                param.city = city;
                param.postal_code = postal_code;
                param.state_code = state_code;
                param.street_line = street_line;

                var _data = JSON.stringify(param);
                $("#gc-step1").css("display", "none");
                $("#gc-step2").css("display", "block");

                $.ajax({
                    type: 'POST',
                    url: "https://5.9.155.139:44376/api/verify/person",
                    data: _data,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }).done(function (data) {
                    if (data && data.status !== false) {
                        if (data.data[0].start < 18) {
                            alert("your age: " + data.data[0].start);
                            console.log("start:" + data.data[0].start + " end: " + data.data[0].end);
                        }
                        else {
                            alert("your age: " + data.data[0].start)
                            console.log("start:" + data.data[0].start + " end: " + data.data[0].end);
                            $("#gc-step2").css("display", "none");
                            $("#gc-step3").css("display", "block");
                        }
                    }
                    else {
                        $("#gc-step2").css("display", "none");
                        $("#gc-step1").css("display", "block");
                        alert("verify fail: " + data.message);
                    }
                }).fail(function (error) {
                    $("#gc-step2").css("display", "none");
                    $("#gc-step1").css("display", "block");
                    alert("verify fail: " + data.message);
                });
            }
        });
    },

    EventButtonCheckPhoto = function () {
        $("input[type=file]").on("click", function (e) {
            e.stopPropagation();
        });

        $("#checkPhotoId").submit(function (e) {
            var firstName = $("#gc-field-first_name").val();
            var lastName = $("#gc-field-last_name").val();
            var nameCardId = firstName + " " + lastName;
            if (nameCardId === null || nameCardId.length === 0) {
                alert("Name is required!");
            }
            else {
                var formData = new FormData($(this)[0]);
                $.ajax({
                    url: "https://5.9.155.139:44376/api/ocr/get_age_from_image/" + nameCardId,
                    type: 'POST',
                    data: formData,
                    async: true,
                    success: function (data) {
                        console.log(data);
                        if (data && data.status !== false) {
                            var birthday = new Date(data.data);
                            var timeNow = new Date();
                            var age = timeNow.getFullYear() - birthday.getFullYear();
                            console.log(age);
                            alert("your age: " + age);
                            $("#gc-step4").css("display", "none");
                            $("#gc-step5").css("display", "block");
                            SetCookie(nameCardId, 1);
                            $(".cart").submit();
                        }
                        else
                        {
                            $("#gc-step4").css("display", "none");
                            $("#gc-step3").css("display", "block");
                            //$("#gc-upload-label").attr("class", "gc-button-continue");
                            //$('input[type="file"]').val(null);
                            alert(data.message);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        $("#gc-step4").css("display", "none");
                        $("#gc-step3").css("display", "block");
                        //$("#gc-upload-label").attr("class", "gc-button-continue");
                        //$('input[type="file"]').val(null);
                        alert("verify fail");
                        console.log("verify fail: " + jqXHR.responseText);
                        if (jqXHR.aborted)
                            return;
                    },
                    complete: function (xhr) {
                        return false;
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });
            }
            e.preventDefault();
            return false;
        });
    },

    GetCitiesInfo = function () {
        $("#gc-field-city").on("change paste keyup", function () {
            var query = $(this).val();
            if (query != null && !query.replace(/\s/g, "") == "") {
                $.ajax({
                    type: 'GET',
                    url: "https://5.9.155.139:44376/api/white_page/get_city/" + query,
                }).done(function (data) {
                    console.log(data);
                    $("#gc-field-city").autocomplete({
                        source: data,
                        open: function () {
                            $("#gc-field-city").autocomplete('widget').zIndex(10);
                        }

                    });
                }).fail(function (error) {
                    console.log(error);
                });
            }
        });
    };

    SetCookie = function (name, extime) {
        var d = new Date();
        d.setTime(d.getTime() + (extime * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = "get_checker_cookie" + "=" + name + ";" + expires + ";path=/";
    },

    GetCookie = function (cookieName) {
        var name = cookieName + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
}());