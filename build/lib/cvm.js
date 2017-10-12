(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var channelService = require('./service/channelService');
var verdor = require("./service/verdor");
var Channel = require('./ele_channel');
var Section = require('./ele_section');
var SetSection = require('./ele_set');
var Carousel = require('./effect/carousel');
var Options = require('./effect/options');
require('./lib/uri');

var prodFlamingoUrl = 'http://prod-flamingo-1448889614.cn-north-1.elb.amazonaws.com.cn:8085';
var stagingFlamingoUrl = 'http://staging.eventslin.com:8080';
var devFlagmingoUrl = 'http://localhost:8085';

setRootUrl(prodFlamingoUrl);

$(function(){
    $.support.cors = true;
    setMode();
    verdor('underscore', init);

    window.CVMset = function(ele){
        var params = {
            setKey : $(ele).attr('setkey'),
            setValue : $(ele).attr('setvalue'),
            limit : $(ele).attr('limit'),
            link : $(ele).attr('link'),
            divisionLink : $(ele).attr('division-link'),
            staticRender : $(ele).attr('static') == 'true'
        }
        SetSection(params, $(ele));
    }
})

function init(res){
    $("[bmy-section]").each(function(){
        var params = {
            limit : $(this).attr('limit'),
            sectionId : $(this).attr('sectionid'),
            link : $(this).attr('link'),
            divisionLink : $(this).attr('division-link'),
            staticRender : $(this).attr('static') == 'true'
        }
        Section(params, this);
    })

    $("[bmy-channel], .bmy-channel").each(function(){
        var params = {
            head : $(this).attr('head'),
            setKey : $(this).attr('setkey'),
            setValue : $(this).attr('setvalue'),
            staticRender : $(this).attr('static') == 'true'
        }
        if($(this).attr('channelid')){
            params.channelId = $(this).attr('channelid');
        }
        Channel(params, this);
    })

    $("[bmy-carousel-gen = 'true'], .bmy-carousel-gen").remove();

    $("[bmy-carousel], .bmy-carousel").each(function(){ 
        var params = {
            autoplay : $(this).attr('autoplay') != undefined
        }
        Carousel(params, $(this));
    })

    $("[bmy-link], .bmy-link").each(function(){
        $(this).click(function(){
            location.href = $(this).attr('bmy-link');
        })
    })

    $("[bmy-set], .bmy-set").each(function(){ 
        var params = {
            setKey : $(this).attr('setkey'),
            setValue : $(this).attr('setvalue'),
            limit : $(this).attr('limit'),
            link : $(this).attr('link'),
            divisionLink : $(this).attr('division-link'),
            staticRender : $(this).attr('static') == 'true'
        }
        SetSection(params, $(this));
    })

    if(window.CVM.mode == 'edit'){
        Options();
    }
}

function setMode(){ 
    window.CVM = window.CVM || {};
    window.CVM.mode = "view";

    if($("body").attr("bmy-active-urlkey") != ""){
        var activeUrlKey = $("body").attr("bmy-active-urlkey");
        if($.getQuery(activeUrlKey) == "true"){
            window.CVM.mode = "edit";
        }
    }
    if($("body").attr("bmy-active") == "true"){
        window.CVM.mode = "edit";
    }
}

function setRootUrl(url){
    window.flamingoRoot = url;
}


},{"./effect/carousel":2,"./effect/options":3,"./ele_channel":5,"./ele_section":10,"./ele_set":11,"./lib/uri":15,"./service/channelService":17,"./service/verdor":21}],2:[function(require,module,exports){
var templateRender = require("../service/templateRender");
var verdor = require("../service/verdor");

function carousel (params, container) {
    verdor('slick', render);

    function render(){
        $(container).hide();
        var slickGen = $(container).clone().attr("bmy-carousel-gen", 'true').insertAfter($(container)).show();
        $(slickGen).slick({
            lazyLoad : true,
            prevArrow : "<div class='slick-prev-arrow'><img src='https://s3.cn-north-1.amazonaws.com.cn/channel.cdn/img/left.png'></div>",
            nextArrow : "<div class='slick-next-arrow'><img src='https://s3.cn-north-1.amazonaws.com.cn/channel.cdn/img/right.png'></div>",
            autoplay : params.autoplay,
            dots : true,
            zIndex : 20
        }); 

        if($("#global-slick-carousel").length == 0){
            $("<div id='global-slick-carousel'></div>").html(templateRender({}, 'styleSlick')).appendTo($("body"));
        }
    }
}

module.exports = carousel;
},{"../service/templateRender":20,"../service/verdor":21}],3:[function(require,module,exports){
var templateRender = require("../service/templateRender");
var channelService = require('../service/channelService');

function options(){
    $(templateRender({}, 'options')).appendTo($('body'));
    var website = $("body").attr('bmy-website');
    var page = $("body").attr('bmy-page');

    $(".channel-options-panels .publish").click(function(){
        var html = preparePublishHtml();  
        channelService.publish(html, "website/" + website + '/' + page + '/index.html', function(){
            alert("发布成功");
        });
    });
}

function preparePublishHtml(){
    $(".hide-when-publish").remove();
    $("#cvm-verdor-scripts").remove();
    return "<!DOCTYPE html><html lang='zh'>" + $("html").html() + "</html>";
}

module.exports = options;
},{"../service/channelService":17,"../service/templateRender":20}],4:[function(require,module,exports){
var channelUtilService = require('../service/channelUtilService');
var templateRender = require("../service/templateRender");
var vendor = require("../service/verdor");

var editPanelStyle = templateRender({}, 'styleEditPanel');
var popup;

function popUp(params) {
    vendor(['bPopup', 'ueditor', 'qiniu'], render);

    function render(){
        $('<div id="bpopup_content_g">' + params.content + editPanelStyle + '</div>').appendTo($("body")).hide();

        popup = $('#bpopup_content_g').bPopup({
            position : ['auto', 20],
            onClose : function(){
                 $("body").find("#bpopup_content_g").remove();  
            }
        });
        if(params.initUeditor){
            initUeditor(params.initUeditor);
        }
        if(params.initImageUpload){
            initImageUpload(params.initImageUpload);
        }
        
        bind(params.bind);
    }
}

function bind(binds){
    _.each(binds, function(b){
        $('#bpopup_content_g').find(b.element).click(function(){
            b.callback($('#bpopup_content_g'), function(close){
                if(close){
                    popup.close(); 
                    $("#bpopup_content_g").remove();    
                }

            });
        })
    })
}

function initUeditor(ele){
    UE.delEditor(ele);
    UE.getEditor(ele, {
        autoHeightEnabled: false
    });

    $("#ue-container .edui-editor-iframeholder iframe").contents().find("body").css({"height":"300px", "overflow-y":"scroll"});
}

function initImageUpload(params) {
    channelUtilService.initUpload([
        {
            btn: params.btn,
            container: params.container,
            progress:params.progress ,
            success: function (url) {
                params.finish(url, function(close){
                    if(close){
                        popup.close(); 
                        $("#bpopup_content_g").remove();    
                    }
                });
            },
            error: function (e) {}
        }
    ], function (errorMessage) {});
}

module.exports = popUp;
},{"../service/channelUtilService":19,"../service/templateRender":20,"../service/verdor":21}],5:[function(require,module,exports){
var channelService = require('./service/channelService');
var templateRender = require("./service/templateRender");
var channelModelService = require('./service/channelModelService');
var Section = require('./ele_section');
var popUp = require('./effect/popUp');

function  Channel(params, container) {
    var channelId;
    if(params.channelId){
        channelId = params.channelId;
    }else if($.getQuery('id')){
        channelId = $.getQuery('id');
    }else{
        channelId = location.hash.slice(1);
    }

	var scope = {
        channel : null,
        channelId : channelId,
		attrs : {},
		titleElement : null,
        showhead : params.showhead != 'no',
        setKey : params.setKey,
        setValue : params.setValue,
        mode : window.CVM.mode
	};

    if(params.staticRender && scope.mode != 'edit')
        return;

    $container = $(container);
    $container.find(".sections-container").remove();
    $container.find(".head-section").remove();

    var $ele = $(templateRender(scope, 'channel')).appendTo($container);
    bind();
    fetch();

    if(scope.mode == 'edit'){
        preparePublicSections();
    }

    function fetch(callback){
        if(scope.channelId){
            channelService.getChannel(scope.channelId, function(res){
                scope.channel = res.data;
                window.console.log('res');
                window.console.log(res);
                scope.title = getAttr(scope.channel, 'title') ? getAttr(scope.channel, 'title') : "标题";
                document.title = scope.title;
                $container.attr('channelid', channelId);
                render();
            })
        }else{
            render();
        }

    };

    function render(){
        renderChannel();
        renderOptions();
        renderAttrField();
    }

    function renderChannel(){
        $ele.find(".sections-container").empty();
        $ele.find(".head-section").empty();
        if(!scope.channel)
            return;

        _.each(scope.channel.sections, function(section){
            if(getAttr(section , 'head') == 'yes'){
                var params = {
                    mode : scope.mode,
                    section : section
                }
                Section(params, $ele.find(".head-section"));
            }else{
                var params = {
                    mode : scope.mode,
                    section : section
                }
                var sectionContainer = $('<div class="section-item"></div>').appendTo($ele.find(".sections-container"));
                Section(params, sectionContainer);       
            }
        })
    }

    function renderAttrField(){
        if(!scope.channel)
            return;

        $("[bmy-channel-attr]").each(function(){
            var key = $(this).attr('bmy-channel-attr');
            if(key){
                var text = getAttr(scope.channel, key) ? getAttr(scope.channel, key) : key;
                $(this).text(text);
            }
        });
    }

    function renderOptions(){
        if(scope.mode == 'edit'){
            $(".channel-options").show();
            if(!scope.channelId){
                $(".status-new").css('display', 'inline-block');
                $(".status-edit").hide();
            }else{
                $(".status-new").hide();
                $(".status-edit").css('display', 'inline-block');
            }
        }else if(scope.mode == 'view'){
            $(".channel-options").hide();
        }
    }

    function bind(){
        $container.find("[bmy-channel-attr]").click(editChannelAttr);
        $(".channel-options .create-channel").click(createChannel);
        $(".channel-options .add-section").click(togglePickSection);
        $(".channel-options .open").click(publish);
    }

    function preparePublicSections(){
        channelService.getSectionsAttributes('eventslinAdminContent', 'publicBuildingSection', function(res){
            scope.publicBuildingSections = res.data;
            _.each(scope.publicBuildingSections, function(section){
                $(templateRender({title:section.title,html:section.descHtml,sectionId:section.sectionId}, 'sectionSnapshot')).appendTo($(".section-pick-panel"));
            })
            $(".section-pick-panel .section-preview-item").click(function(){
                var sectionId = $(this).attr('sectionid');
                insertSection(sectionId);
            })
        }); 
    }

    function togglePickSection(){
        $(".section-pick-panel").toggle();
    }

    function insertSection(sectionId){
        channelService.getSection(sectionId, function(res){
            channelService.addSection(res.data, scope.channel.channelId, function(res){
                channelService.getChannel(scope.channel.channelId, function(res){
                    scope.channel = res.data;
                    render(); 
                    $(".section-pick-panel").toggle();
                })
            })
        });
    }

    function publish(){
        channelService.updateChannelAttr(scope.channel.channelId, 'status', 'open', function(res){
            var html = preparePublishHtml();  
            var website = $("body").attr('bmy-website');
            var page = $("body").attr('bmy-page');
            channelService.publish(html, "website/" + website + '/' + page + '/' + scope.channel.channelId + '.html', function(){
                alert("发布成功");
            });
        });
    }

    function preparePublishHtml(){
        $(".hide-when-publish").remove();
        $("#cvm-verdor-scripts").remove();
        return "<!DOCTYPE html><html lang='zh'>" + $("html").html() + "</html>";
    }

    function getDate(){
        var d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }

    function createChannel(){
        scope.channel = channelModelService.generateChannel('news');
        channelService.addChannel(params.setKey, params.setValue, scope.channel, function(res){
            scope.channel = res.data;
            scope.channelId = scope.channel.channelId;
            $container.attr('channelid', scope.channelId);
            channelService.updateChannelAttr(scope.channel.channelId, 'publishDate', getDate(), function(res){
                updateAttrLocally(scope.channel, 'publishDate', getDate());
                render();
            })
        })
    }

    function editChannelAttr(){
        scope.editAttrKey = $(this).attr('bmy-channel-attr');
        popUp({
            content: templateRender({text: getAttr(scope.channel, scope.editAttrKey)}, 'textEditModal'), 
            bind: [{element:".save", callback:updateAttr}]
        })
    }

    function updateAttr(container, callback){
        var value = container.find(".text-input").val();
        channelService.updateChannelAttr(scope.channel.channelId, scope.editAttrKey, value, function(res){
            updateAttrLocally(scope.channel, scope.editAttrKey, value);
            renderAttrField();
        });
        callback(true);
    }

    function getAttr(element, key){
        if(!element)
            return "";
		var attr = _.find(element.attributes, function(attr){
	        return attr.key == key;
	    })
	    if(attr){
	        return attr.value;
	    }else{
	        return "";
	    }
	}

    function updateAttrLocally(element, key, value){
        var t = _.find(element.attributes, function(attr){
            return attr.key == key;
        })
        if(t){
            t.value = value;
        }else{
            element.attributes.push({key:key, value:value});
        }
    }

	function interpolate(css){
        var s = "#am-" + channelId + "-channel";
        return '<style type="text/css">' + css.replace(/##/g, s) + '</style>';
    }
}

module.exports = Channel;
},{"./effect/popUp":4,"./ele_section":10,"./service/channelModelService":16,"./service/channelService":17,"./service/templateRender":20}],6:[function(require,module,exports){
var templateRender = require("./service/templateRender");
var Element = require('./ele_element');

function  Division (division, mode, $container) {
	var scope = {
		division : division,
        mode : mode
	}
	var $ele = $container;

    prepareAttrs();
    render();

    function prepareAttrs(){
        scope.divisionAttrs = {
            cssValue : getAttr(scope.division, 'cssValue'),
            title : getAttr(scope.division, 'title'),
            textAlign : getAttr(scope.division, 'textAlign'),
            background : getAttr(scope.division, 'background') ? getAttr(scope.division, 'background') : '',
            carousel : getAttr(scope.division, 'carousel') == 'yes',
            carouselNumber : getAttr(scope.division, 'carouselNumber') ? getAttr(scope.division, 'carouselNumber') : 1,
            linkUrl : getAttr(scope.division, 'linkUrl')
        }

        scope.divisionAttrs.width = getAttr(scope.division, 'width') ? getAttr(scope.division, 'width') : '100%';
        scope.divisionAttrs.widthTablet = getAttr(scope.division, 'widthTablet') ? getAttr(scope.division, 'widthTablet') : scope.divisionAttrs.width;
        scope.divisionAttrs.widthMobile = getAttr(scope.division, 'widthMobile') ? getAttr(scope.division, 'widthMobile') : scope.divisionAttrs.widthTablet;
        scope.divisionAttrs.category = getAttr(scope.division, 'category') ? getAttr(scope.division, 'category') : '';

        scope.divisionAttrs.css = templateRender(scope, 'style_division');
        if(scope.divisionAttrs.cssValue){
            scope.divisionAttrs.css =  scope.divisionAttrs.css + interpolate(scope.divisionAttrs.cssValue);
        }
    }

    function render(){
    	$ele = $(templateRender(scope, 'division')).appendTo($container);

        $ele.find(".division-style-container").html(scope.divisionAttrs.css);

        _.each(scope.division.elements, function(element, index){
            element.index = index;
            Element(element, scope.mode, $ele.find(".elements-container"));
        })

        if(scope.divisionAttrs.linkUrl){
            bindLink(scope.divisionAttrs.linkUrl);
        }
        else if(division.linkId && division.link){
            bindLink(division.link + "#" + division.linkId);
        }

        function bindLink(url){
            $ele.click(function(){
                location.href = url;
            })
            $ele.attr('bmy-link', url);
        }
    }

    function getAttr(element, key){
		var attr = _.find(element.attributes, function(attr){
	        return attr.key == key;
	    })
	    if(attr){
	        return attr.value;
	    }else{
	        return "";
	    }
	}

	function interpolate(css){
        var s = "#am-" + scope.division.divisionId + "-division";
        return '<style type="text/css">' + css.replace(/##/g, s) + '</style>';
    }
}



module.exports = Division;
},{"./ele_element":7,"./service/templateRender":20}],7:[function(require,module,exports){
var templateRender = require("./service/templateRender");
var channelModelService = require('./service/channelModelService');
var channelService = require('./service/channelService');
var popUp = require('./effect/popUp');
var ImageElement = require('./ele_imageElement');
var TextElement = require('./ele_textElement');
var HtmlElement = require('./ele_htmlElement');

function  Element (element, mode,  $container) {
	var scope = {
		element : element,
        mode : mode
	}
	var $ele;

	render();

    if(scope.mode == 'edit'){
        $ele.click(edit);
    }

	function render(){
        var content = "";
        scope.attrs = {
            value : scope.element.value,
            cssValue : getAttr(scope.element, 'cssValue'),
            linkUrl : getAttr(scope.element, 'linkUrl'),
            type : getAttr(scope.element, 'type'),
            category : getAttr(scope.element, 'category'),
            title : getAttr(scope.element, 'title'),
            mediaType : getAttr(scope.element, 'mediaType')
        };

        scope.attrs.textAlign = getAttr(scope.element, 'textAlign');
        scope.attrs.color = getAttr(scope.element, 'color') ? getAttr(scope.element, 'color') : '';
        scope.attrs.fontSize = getAttr(scope.element, 'fontSize');
        scope.attrs.width = getAttr(scope.element, 'width') ? getAttr(scope.element, 'width') : '100%';
        scope.attrs.widthTablet = getAttr(scope.element, 'widthTablet') ? getAttr(scope.element, 'widthTablet') : scope.attrs.width;
        scope.attrs.widthMobile = getAttr(scope.element, 'widthMobile') ? getAttr(scope.element, 'widthMobile') : scope.attrs.widthTablet;
        scope.attrs.height = getAttr(scope.element, 'height') ? getAttr(scope.element, 'height') : 'auto';
        scope.attrs.category = getAttr(scope.element, 'category') ? getAttr(scope.element, 'category') : '';

        scope.attrs.css = "";
        if(scope.attrs.cssValue){
            scope.attrs.css =  scope.attrs.css + interpolate(scope.attrs.cssValue);
        }

        var type = getAttr(scope.element, 'type');
        if(channelModelService.isImageElement(type)){
            scope.elementType = 'image';
            scope.attrs.asBackground = getAttr(scope.element, 'asBackground') == 'yes';
            content  = ImageElement(scope.element);
        }else if(channelModelService.isTextElement(type)){
            scope.elementType = 'text';
            content  = TextElement(scope.element);
        }else if(channelModelService.isHtmlElement(type)){
            scope.elementType = 'html';
            content  = HtmlElement(scope.element);
        }else if(type == 'richtext'){
            scope.elementType = 'richtext';
            content  = HtmlElement(scope.element);
        }
        
        if($ele){
            $ele.find(".americano-element .element-content").html("");
        }
        else{
           $ele = $(templateRender(scope, 'element')).appendTo($container); 
        }
        
        $ele.find(".element-content").html(content);
        $ele.find(".element-style-container").html(scope.attrs.css);
    }

    function edit(){
        var inits = [];

        var params = {
            content: templateRender({value: scope.attrs.value}, scope.elementType + 'ElementEdit'), 
            bind: [{element:".save", callback:saveValue}]
        }
        if(scope.elementType == 'richtext'){
            params.initUeditor = "ue-container";
        }
        if(scope.elementType == 'image'){
            params.initImageUpload = {
                btn : "image-upload-btn",
                container : "image-sample-container",
                progress : progressUpdate,
                finish : updateValue
            }; 
        }
        if(scope.elementType == 'text'){
            var e = $('<div>' + params.content + '</div>');
            e.find(".element-value").html(scope.attrs.value);
            params.content = $(e).html();
        }

        popUp(params);
        return false;
    }

    function saveValue(container, callback){
        var value;
        if(scope.elementType == 'text'){
            value = container.find(".element-value").val();
        }else if(scope.elementType == 'richtext'){
            value = container.find("#ue-container .edui-editor-iframeholder iframe").contents().find("body").html();
        }
        updateValue(value, callback);
    }

    function updateValue(value, callback){
        scope.element.value = value;
        channelService.updateElement(scope.element, function(){
            render();
            callback(true);
        })
    }

    function progressUpdate(percent){
        $(".modal-dialog .uploading-msg").text("上传中.." + percent + "%");
    }

    function getAttr(element, key){
		var attr = _.find(element.attributes, function(attr){
	        return attr.key == key;
	    })
	    if(attr){
	        return attr.value;
	    }else{
	        return "";
	    }
	}

	function interpolate(css){
        var s = "#am-" + scope.element.elementId + "-element";
        return '<style type="text/css">' + css.replace(/##/g, s) + '</style>';
    }

    function closeModal(){
        $(".modal").remove();
        $(".modal-backdrop").remove();
        $("#edui_fixedlayer").remove();
    }
}

module.exports = Element;
},{"./effect/popUp":4,"./ele_htmlElement":8,"./ele_imageElement":9,"./ele_textElement":12,"./service/channelModelService":16,"./service/channelService":17,"./service/templateRender":20}],8:[function(require,module,exports){
var templateRender = require("./service/templateRender");

function htmlElement(element) {
	var nonLinkDom1 = ['<div style="display:inline-block; width:100%;"><div>', '</div></div>'];
	var linkDon1 = ['<a href="' + getAttr(element, 'linkUrl') + '" target="_blank"><div>', '</div></a>'];
	var dom1 = getAttr(element, 'linkUrl') ? linkDon1 : nonLinkDom1;
	var html = dom1[0] + element.value + dom1[1];
	return templateRender({html: html}, 'htmlElement');

    function getAttr(element, key){
		var attr = _.find(element.attributes, function(attr){
	        return attr.key == key;
	    })
	    if(attr){
	        return attr.value;
	    }else{
	        return "";
	    }
	}
}
module.exports = htmlElement;
},{"./service/templateRender":20}],9:[function(require,module,exports){
var templateRender = require("./service/templateRender");

function imageElement(element) {
	var content = "";

	function getSrc(){
		if(!getAttr(element, 'thumbnailWidth')){
            return element.value;
        }
        
        var img = element.value;
        if (img.indexOf("imageMogr2/thumbnail") < 0 && img.indexOf("qiniu") > 0) {
          img = img + "?imageMogr2/thumbnail/" + getAttr(element, 'thumbnailWidth');
        }
        return img;
	}

	var nonLinkDom1 = ['<div style="display:inline-block; width:100%;">', '</div>'];
	var linkDon1 = ['<a href="' + getAttr(element, 'linkUrl') + '" target="_blank">', '</a>'];

	var nonBackgroundDom2 = '<img src="' + getSrc() + '" class="image-item">';
	var backgroundDom2 = '<div style="background-image: url(' + getSrc() + ');background-position: 50% 50%;background-size: auto 100%; background-repeat: no-repeat;" class="image-frame"></div>';
	var dom1 = getAttr(element, 'linkUrl') ? linkDon1 : nonLinkDom1;
	var dom2 = getAttr(element, 'asBackground') == 'yes' ? backgroundDom2 : nonBackgroundDom2;

	return templateRender({html: dom1[0] + "<div>" + dom2 + "</div>" + dom1[1]}, 'imageElement');

    function getAttr(element, key){
		var attr = _.find(element.attributes, function(attr){
	        return attr.key == key;
	    })
	    if(attr){
	        return attr.value;
	    }else{
	        return "";
	    }
	}
}
module.exports = imageElement;
},{"./service/templateRender":20}],10:[function(require,module,exports){
var channelSyncService = require('./service/channelSyncService');
var channelService = require('./service/channelService');
var templateRender = require("./service/templateRender");
var Division = require('./ele_division');
var Element = require('./ele_element');
var Carousel = require('./effect/carousel');

function  Section (params, container) {
	var scope = {
        section : params.section ? params.section : null,
        sectionId : params.sectionId,
		attrs : {},
		titleElement : null,
        mode : window.CVM.mode
	};
    
    if(params.staticRender && scope.mode != 'edit')
        return;

	var $ele = $container = $(container);

    if(!scope.section){
        fetch(function(){
            contentSync(function(){
                prepareAttrs();
                render();
                effect();
            })
        });
    }else{
        contentSync(function(){
            prepareAttrs();
            render();
            effect();
        })
    }

    function fetch(callback){
        channelService.getSection(scope.sectionId, function(res){
            scope.section = res.data;
            callback();
        })
    };

    function contentSync(callback){
    	if(getAttr(scope.section, 'contentSync') == 'yes'){
            channelSyncService.syncSection(scope.section, params.limit, function(section){
                scope.section = section;
                callback();
            });
        }else{
            callback();
        }
    }

    function prepareAttrs(){
        var section = scope.section;
    	scope.attrs = {
            status : getAttr(section, 'status'),
            cssValue : getAttr(section, 'cssValue'),
            title : getAttr(section, 'title'),
            displayTitle :  getAttr(section, 'displayTitle') != 'no',
            width : getAttr(section, 'width') == 'full' ? '100%' : '1000px',
            textAlign : getAttr(section, 'textAlign') ? getAttr(section, 'textAlign') : 'center',
            backgroundColor : getAttr(section, 'backgroundColor'),
            backgroundImg : getAttr(section, 'backgroundImg') ? getAttr(section, 'backgroundImg') : '',
            carousel : getAttr(section, 'carousel') == 'yes',
            carouselNumber : getAttr(section, 'carouselNumber') ? getAttr(section, 'carouselNumber') : 1,
            carouselAutoPlay : getAttr(section, 'carouselAutoPlay') == 'yes',
            participantLimited : getAttr(section, 'participantLimited') == 'yes',
            contentSyncToggle : getAttr(section, 'contentSync') != '' || getAttr(section, 'eventSyncKey'),
            contentSync : getAttr(section, 'contentSync') == 'yes',
            syncType : getAttr(section, 'syncType'),
            syncSetKey : getAttr(section, 'syncSetKey'),
            syncSetValue : getAttr(section, 'syncSetValue')
        };
      	scope.attrs.css = templateRender(scope, 'style_section');
        
        if(getAttr(section, 'cssKey')){
            scope.attrs.css += templateRender(scope, 'style_' + getAttr(section, 'cssKey') + '_section');
        }
        if(scope.attrs.cssValue){
            scope.attrs.css =  scope.attrs.css + interpolate(scope.attrs.cssValue);
        }
        if(scope.attrs.carousel){
            scope.attrs.css =  scope.attrs.css + templateRender(scope, 'styleSlick');
        }
    }

    function render(){
        $container.find(".americano-section").remove();
     	$ele = $(templateRender(scope, 'section')).appendTo($container);

        $ele.find(".section-style-container").html(scope.attrs.css);

        if(getAttr(scope.section, 'displayTitle') != 'no' && getAttr(scope.section, 'title')){
            var title =  textElement({value: getAttr(scope.section, 'title')});
            Element(title, $ele.find(".section-title-element"));
        }

        _.each(scope.section.divisions, function(division, index){
            division.index = index;
            if(params.divisionLink){
                division.link = params.divisionLink; 
            } 
            Division(division, scope.mode, $ele.find(".divisions-container"));
        })
    }

    function effect(){
        if(scope.attrs.carousel){
            var params = {
                autoplay : scope.attrs.carouselAutoPlay
            }
            Carousel(params ,$ele.find(".divisions-container"));
        }
    }

    function getAttr(element, key){
		var attr = _.find(element.attributes, function(attr){
	        return attr.key == key;
	    })
	    if(attr){
	        return attr.value;
	    }else{
	        return "";
	    }
	}

	function interpolate(css){
        var s = "#am-" + scope.section.sectionId + "-section";
        return '<style type="text/css">' + css.replace(/##/g, s) + '</style>';
    }

    function textElement(params){
        var params = params ? params : {};
        params.attributes = params.attributes ? params.attributes : [];
        return {
            key : "",
            value : params.value ? params.value : "text",
            attributes : _.union([{
                key : "type",
                value : params.type ? params.type : 'text'
            }], params.attributes)
        }
    }
}

module.exports = Section;
},{"./effect/carousel":2,"./ele_division":6,"./ele_element":7,"./service/channelService":17,"./service/channelSyncService":18,"./service/templateRender":20}],11:[function(require,module,exports){
var channelSyncService = require('./service/channelSyncService');
var channelService = require('./service/channelService');
var templateRender = require("./service/templateRender");
var Division = require('./ele_division');
var Element = require('./ele_element');
var Carousel = require('./effect/carousel');

function  SetSection (params, container) {
	var scope = {
        section : null,
		attrs : {},
        mode : window.CVM.mode
	};
    
    if(params.staticRender && scope.mode != 'edit')
        return;

	var $ele = $container = $(container);

    prepareSetSection(function(){
        prepareAttrs();
        render();
        effect();
    })

    function prepareSetSection(callback){
        channelSyncService.syncSetSection(params, function(section){
            scope.section = section;
            section.sectionId = "set-" + params.setKey + "-" + params.setValue;
            updateAttrLocally(section, 'cssKey', 'setlist');
            callback();
        });
    }

    function prepareAttrs(){
        var section = scope.section;
    	scope.attrs = {
            status : getAttr(section, 'status'),
            cssValue : getAttr(section, 'cssValue'),
            title : getAttr(section, 'title'),
            displayTitle :  getAttr(section, 'displayTitle') != 'no',
            width : getAttr(section, 'width') == 'full' ? '100%' : '1000px',
            textAlign : getAttr(section, 'textAlign') ? getAttr(section, 'textAlign') : 'center',
            backgroundColor : getAttr(section, 'backgroundColor'),
            backgroundImg : getAttr(section, 'backgroundImg') ? getAttr(section, 'backgroundImg') : '',
            carousel : getAttr(section, 'carousel') == 'yes',
            carouselNumber : getAttr(section, 'carouselNumber') ? getAttr(section, 'carouselNumber') : 1,
            carouselAutoPlay : getAttr(section, 'carouselAutoPlay') == 'yes',
            participantLimited : getAttr(section, 'participantLimited') == 'yes',
            contentSyncToggle : getAttr(section, 'contentSync') != '' || getAttr(section, 'eventSyncKey'),
            contentSync : getAttr(section, 'contentSync') == 'yes',
            syncType : getAttr(section, 'syncType'),
            syncSetKey : getAttr(section, 'syncSetKey'),
            syncSetValue : getAttr(section, 'syncSetValue')
        };
      	scope.attrs.css = templateRender(scope, 'style_section');
        
        if(getAttr(section, 'cssKey')){
            scope.attrs.css += templateRender(scope, 'style_' + getAttr(section, 'cssKey') + '_section');
        }
        if(scope.attrs.cssValue){
            scope.attrs.css =  scope.attrs.css + interpolate(scope.attrs.cssValue);
        }
        if(scope.attrs.carousel){
            scope.attrs.css =  scope.attrs.css + templateRender(scope, 'styleSlick');
        }
    }

    function render(){
        $container.find(".americano-section").remove();
     	$ele = $(templateRender(scope, 'section')).appendTo($container);

        $ele.find(".section-style-container").html(scope.attrs.css);

        if(getAttr(scope.section, 'displayTitle') != 'no' && getAttr(scope.section, 'title')){
            var title =  textElement({value: getAttr(scope.section, 'title')});
            Element(title, $ele.find(".section-title-element"));
        }

        _.each(scope.section.divisions, function(division, index){
            division.index = index;
            if(params.divisionLink){
                division.link = params.divisionLink; 
            } 
            Division(division, scope.mode, $ele.find(".divisions-container"));
        })
    }

    function effect(){
        if(scope.attrs.carousel){
            var params = {
                autoplay : scope.attrs.carouselAutoPlay
            }
            Carousel(params ,$ele.find(".divisions-container"));
        }
    }

    function getAttr(element, key){
		var attr = _.find(element.attributes, function(attr){
	        return attr.key == key;
	    })
	    if(attr){
	        return attr.value;
	    }else{
	        return "";
	    }
	}

	function interpolate(css){
        var s = "#am-" + scope.section.sectionId + "-section";
        return '<style type="text/css">' + css.replace(/##/g, s) + '</style>';
    }

    function textElement(params){
        var params = params ? params : {};
        params.attributes = params.attributes ? params.attributes : [];
        return {
            key : "",
            value : params.value ? params.value : "text",
            attributes : _.union([{
                key : "type",
                value : params.type ? params.type : 'text'
            }], params.attributes)
        }
    }

    function updateAttrLocally(element, key, value){
        var t = _.find(element.attributes, function(attr){
            return attr.key == key;
        })
        if(t){
            t.value = value;
        }else{
            element.attributes.push({key:key, value:value});
        }
    }
}

module.exports = SetSection;
},{"./effect/carousel":2,"./ele_division":6,"./ele_element":7,"./service/channelService":17,"./service/channelSyncService":18,"./service/templateRender":20}],12:[function(require,module,exports){
var templateRender = require("./service/templateRender");

function textElement(element) {
	var nonLinkDom1 = ['<div style="display:inline-block; width:100%;"><p>', '</p></div>'];
	var linkDon1 = ['<a href="' + getAttr(element, 'linkUrl') + '" target="_blank"><span>', '</span></a>'];
	var dom1 = getAttr(element, 'linkUrl') ? linkDon1 : nonLinkDom1;
	var html = dom1[0] + element.value + dom1[1];
	return templateRender({html:html}, 'textElement');

    function getAttr(element, key){
		var attr = _.find(element.attributes, function(attr){
	        return attr.key == key;
	    })
	    if(attr){
	        return attr.value;
	    }else{
	        return "";
	    }
	}
}
module.exports = textElement;
},{"./service/templateRender":20}],13:[function(require,module,exports){
(function(){var rsplit=function(string,regex){var result=regex.exec(string),retArr=new Array(),first_idx,last_idx,first_bit;while(result!=null){first_idx=result.index;last_idx=regex.lastIndex;if((first_idx)!=0){first_bit=string.substring(0,first_idx);retArr.push(string.substring(0,first_idx));string=string.slice(first_idx)}retArr.push(result[0]);string=string.slice(result[0].length);result=regex.exec(string)}if(!string==""){retArr.push(string)}return retArr},chop=function(string){return string.substr(0,string.length-1)},extend=function(d,s){for(var n in s){if(s.hasOwnProperty(n)){d[n]=s[n]}}};EJS=function(options){options=typeof options=="string"?{view:options}:options;this.set_options(options);if(options.precompiled){this.template={};this.template.process=options.precompiled;EJS.update(this.name,this);return }if(options.element){if(typeof options.element=="string"){var name=options.element;options.element=document.getElementById(options.element);if(options.element==null){throw name+"does not exist!"}}if(options.element.value){this.text=options.element.value}else{this.text=options.element.innerHTML}this.name=options.element.id;this.type="["}else{if(options.url){options.url=EJS.endExt(options.url,this.extMatch);this.name=this.name?this.name:options.url;var url=options.url;var template=EJS.get(this.name,this.cache);if(template){return template}if(template==EJS.INVALID_PATH){return null}try{this.text=EJS.request(url+(this.cache?"":"?"+Math.random()))}catch(e){}if(this.text==null){throw ({type:"EJS",message:"There is no template at "+url})}}}var template=new EJS.Compiler(this.text,this.type);template.compile(options,this.name);EJS.update(this.name,this);this.template=template};EJS.prototype={render:function(object,extra_helpers){object=object||{};this._extra_helpers=extra_helpers;var v=new EJS.Helpers(object,extra_helpers||{});return this.template.process.call(object,object,v)},update:function(element,options){if(typeof element=="string"){element=document.getElementById(element)}if(options==null){_template=this;return function(object){EJS.prototype.update.call(_template,element,object)}}if(typeof options=="string"){params={};params.url=options;_template=this;params.onComplete=function(request){var object=eval(request.responseText);EJS.prototype.update.call(_template,element,object)};EJS.ajax_request(params)}else{element.innerHTML=this.render(options)}},out:function(){return this.template.out},set_options:function(options){this.type=options.type||EJS.type;this.cache=options.cache!=null?options.cache:EJS.cache;this.text=options.text||null;this.name=options.name||null;this.ext=options.ext||EJS.ext;this.extMatch=new RegExp(this.ext.replace(/\./,"."))}};EJS.endExt=function(path,match){if(!path){return null}match.lastIndex=0;return path+(match.test(path)?"":this.ext)};EJS.Scanner=function(source,left,right){extend(this,{left_delimiter:left+"%",right_delimiter:"%"+right,double_left:left+"%%",double_right:"%%"+right,left_equal:left+"%=",left_comment:left+"%#"});this.SplitRegexp=left=="["?/(\[%%)|(%%\])|(\[%=)|(\[%#)|(\[%)|(%\]\n)|(%\])|(\n)/:new RegExp("("+this.double_left+")|(%%"+this.double_right+")|("+this.left_equal+")|("+this.left_comment+")|("+this.left_delimiter+")|("+this.right_delimiter+"\n)|("+this.right_delimiter+")|(\n)");this.source=source;this.stag=null;this.lines=0};EJS.Scanner.to_text=function(input){if(input==null||input===undefined){return""}if(input instanceof Date){return input.toDateString()}if(input.toString){return input.toString()}return""};EJS.Scanner.prototype={scan:function(block){scanline=this.scanline;regex=this.SplitRegexp;if(!this.source==""){var source_split=rsplit(this.source,/\n/);for(var i=0;i<source_split.length;i++){var item=source_split[i];this.scanline(item,regex,block)}}},scanline:function(line,regex,block){this.lines++;var line_split=rsplit(line,regex);for(var i=0;i<line_split.length;i++){var token=line_split[i];if(token!=null){try{block(token,this)}catch(e){throw {type:"EJS.Scanner",line:this.lines}}}}}};EJS.Buffer=function(pre_cmd,post_cmd){this.line=new Array();this.script="";this.pre_cmd=pre_cmd;this.post_cmd=post_cmd;for(var i=0;i<this.pre_cmd.length;i++){this.push(pre_cmd[i])}};EJS.Buffer.prototype={push:function(cmd){this.line.push(cmd)},cr:function(){this.script=this.script+this.line.join("; ");this.line=new Array();this.script=this.script+"\n"},close:function(){if(this.line.length>0){for(var i=0;i<this.post_cmd.length;i++){this.push(pre_cmd[i])}this.script=this.script+this.line.join("; ");line=null}}};EJS.Compiler=function(source,left){this.pre_cmd=["var ___ViewO = [];"];this.post_cmd=new Array();this.source=" ";if(source!=null){if(typeof source=="string"){source=source.replace(/\r\n/g,"\n");source=source.replace(/\r/g,"\n");this.source=source}else{if(source.innerHTML){this.source=source.innerHTML}}if(typeof this.source!="string"){this.source=""}}left=left||"<";var right=">";switch(left){case"[":right="]";break;case"<":break;default:throw left+" is not a supported deliminator";break}this.scanner=new EJS.Scanner(this.source,left,right);this.out=""};EJS.Compiler.prototype={compile:function(options,name){options=options||{};this.out="";var put_cmd="___ViewO.push(";var insert_cmd=put_cmd;var buff=new EJS.Buffer(this.pre_cmd,this.post_cmd);var content="";var clean=function(content){content=content.replace(/\\/g,"\\\\");content=content.replace(/\n/g,"\\n");content=content.replace(/"/g,'\\"');return content};this.scanner.scan(function(token,scanner){if(scanner.stag==null){switch(token){case"\n":content=content+"\n";buff.push(put_cmd+'"'+clean(content)+'");');buff.cr();content="";break;case scanner.left_delimiter:case scanner.left_equal:case scanner.left_comment:scanner.stag=token;if(content.length>0){buff.push(put_cmd+'"'+clean(content)+'")')}content="";break;case scanner.double_left:content=content+scanner.left_delimiter;break;default:content=content+token;break}}else{switch(token){case scanner.right_delimiter:switch(scanner.stag){case scanner.left_delimiter:if(content[content.length-1]=="\n"){content=chop(content);buff.push(content);buff.cr()}else{buff.push(content)}break;case scanner.left_equal:buff.push(insert_cmd+"(EJS.Scanner.to_text("+content+")))");break}scanner.stag=null;content="";break;case scanner.double_right:content=content+scanner.right_delimiter;break;default:content=content+token;break}}});if(content.length>0){buff.push(put_cmd+'"'+clean(content)+'")')}buff.close();this.out=buff.script+";";var to_be_evaled="/*"+name+"*/this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {"+this.out+" return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}};";try{eval(to_be_evaled)}catch(e){if(typeof JSLINT!="undefined"){JSLINT(this.out);for(var i=0;i<JSLINT.errors.length;i++){var error=JSLINT.errors[i];if(error.reason!="Unnecessary semicolon."){error.line++;var e=new Error();e.lineNumber=error.line;e.message=error.reason;if(options.view){e.fileName=options.view}throw e}}}else{throw e}}}};EJS.config=function(options){EJS.cache=options.cache!=null?options.cache:EJS.cache;EJS.type=options.type!=null?options.type:EJS.type;EJS.ext=options.ext!=null?options.ext:EJS.ext;var templates_directory=EJS.templates_directory||{};EJS.templates_directory=templates_directory;EJS.get=function(path,cache){if(cache==false){return null}if(templates_directory[path]){return templates_directory[path]}return null};EJS.update=function(path,template){if(path==null){return }templates_directory[path]=template};EJS.INVALID_PATH=-1};EJS.config({cache:true,type:"<",ext:".ejs"});EJS.Helpers=function(data,extras){this._data=data;this._extras=extras;extend(this,extras)};EJS.Helpers.prototype={view:function(options,data,helpers){if(!helpers){helpers=this._extras}if(!data){data=this._data}return new EJS(options).render(data,helpers)},to_text:function(input,null_text){if(input==null||input===undefined){return null_text||""}if(input instanceof Date){return input.toDateString()}if(input.toString){return input.toString().replace(/\n/g,"<br />").replace(/''/g,"'")}return""}};EJS.newRequest=function(){var factories=[function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new XMLHttpRequest()},function(){return new ActiveXObject("Microsoft.XMLHTTP")}];for(var i=0;i<factories.length;i++){try{var request=factories[i]();if(request!=null){return request}}catch(e){continue}}};EJS.request=function(path){var request=new EJS.newRequest();request.open("GET",path,false);try{request.send(null)}catch(e){return null}if(request.status==404||request.status==2||(request.status==0&&request.responseText=="")){return null}return request.responseText};EJS.ajax_request=function(params){params.method=(params.method?params.method:"GET");var request=new EJS.newRequest();request.onreadystatechange=function(){if(request.readyState==4){if(request.status==200){params.onComplete(request)}else{params.onComplete(request)}}};request.open(params.method,params.url);request.send(null)}})();EJS.Helpers.prototype.date_tag=function(C,O,A){if(!(O instanceof Date)){O=new Date()}var B=["January","February","March","April","May","June","July","August","September","October","November","December"];var G=[],D=[],P=[];var J=O.getFullYear();var H=O.getMonth();var N=O.getDate();for(var M=J-15;M<J+15;M++){G.push({value:M,text:M})}for(var E=0;E<12;E++){D.push({value:(E),text:B[E]})}for(var I=0;I<31;I++){P.push({value:(I+1),text:(I+1)})}var L=this.select_tag(C+"[year]",J,G,{id:C+"[year]"});var F=this.select_tag(C+"[month]",H,D,{id:C+"[month]"});var K=this.select_tag(C+"[day]",N,P,{id:C+"[day]"});return L+F+K};EJS.Helpers.prototype.form_tag=function(B,A){A=A||{};A.action=B;if(A.multipart==true){A.method="post";A.enctype="multipart/form-data"}return this.start_tag_for("form",A)};EJS.Helpers.prototype.form_tag_end=function(){return this.tag_end("form")};EJS.Helpers.prototype.hidden_field_tag=function(A,C,B){return this.input_field_tag(A,C,"hidden",B)};EJS.Helpers.prototype.input_field_tag=function(A,D,C,B){B=B||{};B.id=B.id||A;B.value=D||"";B.type=C||"text";B.name=A;return this.single_tag_for("input",B)};EJS.Helpers.prototype.is_current_page=function(A){return(window.location.href==A||window.location.pathname==A?true:false)};EJS.Helpers.prototype.link_to=function(B,A,C){if(!B){var B="null"}if(!C){var C={}}if(C.confirm){C.onclick=' var ret_confirm = confirm("'+C.confirm+'"); if(!ret_confirm){ return false;} ';C.confirm=null}C.href=A;return this.start_tag_for("a",C)+B+this.tag_end("a")};EJS.Helpers.prototype.submit_link_to=function(B,A,C){if(!B){var B="null"}if(!C){var C={}}C.onclick=C.onclick||"";if(C.confirm){C.onclick=' var ret_confirm = confirm("'+C.confirm+'"); if(!ret_confirm){ return false;} ';C.confirm=null}C.value=B;C.type="submit";C.onclick=C.onclick+(A?this.url_for(A):"")+"return false;";return this.start_tag_for("input",C)};EJS.Helpers.prototype.link_to_if=function(F,B,A,D,C,E){return this.link_to_unless((F==false),B,A,D,C,E)};EJS.Helpers.prototype.link_to_unless=function(E,B,A,C,D){C=C||{};if(E){if(D&&typeof D=="function"){return D(B,A,C,D)}else{return B}}else{return this.link_to(B,A,C)}};EJS.Helpers.prototype.link_to_unless_current=function(B,A,C,D){C=C||{};return this.link_to_unless(this.is_current_page(A),B,A,C,D)};EJS.Helpers.prototype.password_field_tag=function(A,C,B){return this.input_field_tag(A,C,"password",B)};EJS.Helpers.prototype.select_tag=function(D,G,H,F){F=F||{};F.id=F.id||D;F.value=G;F.name=D;var B="";B+=this.start_tag_for("select",F);for(var E=0;E<H.length;E++){var C=H[E];var A={value:C.value};if(C.value==G){A.selected="selected"}B+=this.start_tag_for("option",A)+C.text+this.tag_end("option")}B+=this.tag_end("select");return B};EJS.Helpers.prototype.single_tag_for=function(A,B){return this.tag(A,B,"/>")};EJS.Helpers.prototype.start_tag_for=function(A,B){return this.tag(A,B)};EJS.Helpers.prototype.submit_tag=function(A,B){B=B||{};B.type=B.type||"submit";B.value=A||"Submit";return this.single_tag_for("input",B)};EJS.Helpers.prototype.tag=function(C,E,D){if(!D){var D=">"}var B=" ";for(var A in E){if(E[A]!=null){var F=E[A].toString()}else{var F=""}if(A=="Class"){A="class"}if(F.indexOf("'")!=-1){B+=A+'="'+F+'" '}else{B+=A+"='"+F+"' "}}return"<"+C+B+D};EJS.Helpers.prototype.tag_end=function(A){return"</"+A+">"};EJS.Helpers.prototype.text_area_tag=function(A,C,B){B=B||{};B.id=B.id||A;B.name=B.name||A;C=C||"";if(B.size){B.cols=B.size.split("x")[0];B.rows=B.size.split("x")[1];delete B.size}B.cols=B.cols||50;B.rows=B.rows||4;return this.start_tag_for("textarea",B)+C+this.tag_end("textarea")};EJS.Helpers.prototype.text_tag=EJS.Helpers.prototype.text_area_tag;EJS.Helpers.prototype.text_field_tag=function(A,C,B){return this.input_field_tag(A,C,"text",B)};EJS.Helpers.prototype.url_for=function(A){return'window.location="'+A+'";'};EJS.Helpers.prototype.img_tag=function(B,C,A){A=A||{};A.src=B;A.alt=C;return this.single_tag_for("img",A)}
},{}],14:[function(require,module,exports){
/**
SidJS - JavaScript And CSS Lazy Loader 0.1

Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SidJS nor the names of its contributors may be
      used to endorse or promote products derived from this software without
      specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Sniffing by Boris Popoff <http://gueschla.com/> (see http://dean.edwards.name/weblog/2007/03/sniff/)

So why sniff? Well, the state of the browser is pretty fucked up:
Opera:
- script:
    - detects load
    - triggers load, readystatechange
- link:
    - detects load
    - triggers load
Safari, Chrome, Firefox:
- script:
    - detects load
    - triggers load
- link:
    - detects load (WebKit)
    - triggers NONE
IE8:
- script:
    - detects readystatechange
    - triggers readystatechange
- link:
    - detects load, readystatechange
    - triggers load, readystatechange
Assume all versions of IE support readystatechange
*/
(function() {
	var win = window,
		doc = document,
		proto = 'prototype',
		head = doc.getElementsByTagName('head')[0],
		body = doc.getElementsByTagName('body')[0],
		sniff = /*@cc_on!@*/1 + /(?:Gecko|AppleWebKit)\/(\S*)/.test(navigator.userAgent); // 0 - IE, 1 - O, 2 - GK/WK

	var createNode = function(tag, attrs) {
		var attr, node = doc.createElement(tag);
		for (attr in attrs) {
			if (attrs.hasOwnProperty(attr)) {
				node.setAttribute(attr, attrs[attr]);
			}
		}
		return node;
	};

	var load = function(type, urls, callback, scope) {
		if (this == win) {
			return new load(type, urls, callback, scope);
		}

		urls = (typeof urls == 'string' ? [urls] : urls);
		scope = (scope ? (scope) : (type == 'js' ? body : head));

		this.callback = callback || function() {};
		this.queue = [];

		var node, i = len = 0, that = this;

		for (i = 0, len = urls.length; i < len; i++) {
			this.queue[i] = 1;
			if (type == 'css') {
				node = createNode('link', { type: 'text/css', rel: 'stylesheet', href: urls[i] });
			}
			else {
				node = createNode('script', { type: 'text/javascript', src: urls[i] });
			}

			scope.appendChild(node);

			if (sniff) {
				if (type == 'css' && sniff == 2) {
					var intervalID = setInterval(function() {
						try {
							node.sheet.cssRules;
							clearInterval(intervalID);
							that.__callback();
						}
						catch (ex) {}
					}, 100);
				}
				else {
					node.onload = function() {
						that.__callback();
					}
				}
			}
			else {
				node.onreadystatechange = function() {
					if (/^loaded|complete$/.test(this.readyState)) {
						this.onreadystatechange = null;
						that.__callback();
					}
				};
			}
		}

		return this;
	};
	load[proto].__callback = function() {
		if (this.queue.pop() && (this.queue == 0)) { this.callback(); }
	};

	window.Sid = {
		css: function(urls, callback, scope) {
			return load('css', urls, callback, scope);
		},
		js: function(urls, callback, scope) {
			return load('js', urls, callback, scope);
		},
		load: function(type, urls, callback, scope) {
			return load(type, urls, callback, scope);
		}
	};
})();

},{}],15:[function(require,module,exports){
(function($){
    $.getQuery = function( query ) {
        if(!query)
            return;
        
        query = query.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var expr = "[\\?&]"+query+"=([^&#]*)";
        var regex = new RegExp( expr );
        var results = regex.exec( window.location.href );
        if( results !== null ) {
            return results[1];
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        } else {
            return false;
        }
    };
})(jQuery);
},{}],16:[function(require,module,exports){
function isImageElement (type){
    if(type == 'image'){
        return true;
    }
    return false;
}

function isTextElement (type){
    if(type == 'sectiontitle' || type == 'itemtitle' || type == 'text' || type == 'description'|| type == 'icontext'  || type == 'linktext'){
        return true;
    }
    return false;
}

function isHtmlElement (type){
    if(type == 'html'){
        return true;
    }
    return false;
}

function isPersonElement (type){
    if(type == 'person'){
        return true;
    }
    return false;
}

function generateChannel(type, params) {
    var params = params ? params : {};
    var channel = {
        sections : [],
        attributes : [{
            key : "type",
            value : ''
        }]
    }
    if(type == 'channel'){
        channel.sections.push(generateSection('head'));
    }else if(type == 'news'){
        channel.sections.push(generateSection('head'));
        channel.sections.push(generateSection('post'));
    }
    return channel;
}

function generateSection (category, params) {
    var that = this;

    var sectionParams = sectionAttrs(category, params);
    var section = newSection(sectionParams);
    if(sectionParams.sampleDivision){
        var division = sectionParams.sampleDivision();
        setAttr(division, 'sample', 'yes');
        section.divisions.push(division);
        for(var i = 0; i < sectionParams.sampleDivisionRepeat; i++){
            section.divisions.push(sectionParams.sampleDivision());
        }
    }
    return section;
};

function sectionAttrs (category, params){
    if(category == 'head'){
        return headSectionAttrs();
    }else if(category == 'tickets'){
        return ticketsSectionAttrs();
    }else if(category == 'agenda'){
        return agendaSectionAttrs();
    }else if(category == 'persons'){
        return personsSectionAttrs();
    }else if(category == 'organizations'){
        return organizationsSectionAttrs();
    }else if(category == 'post'){
        return postSectionAttrs();
    }else if(category == 'news'){
        return newsSectionAttrs(params);
    }else{
        return {};
    }
}

 function headSectionAttrs(){
    return  {
        head : 'yes',
        sectionCategory : 'clinghead',
        displayTitle : 'no',
        divisions : clingDivisions(),
        cssKey : 'clinghead'
    }
}

function clingDivisions(){
    var divisions = [];
    var division = {
        attributes : [],
        elements : []
    }
    division.elements.push(
        imageElement({asBackground:'yes', height:'160px', width:'100%'})
    )
    division.elements.push(
        textElement({
            value : "标题文字",
            type : "itemtitle"
        })
    );
    division.elements.push(
        textElement({
            value : "描述文字",
            type : "description"
        })
    );
    divisions.push(division);
    return divisions;
}

function postSectionAttrs(){
    return  {
        title : "新闻",
        sectionCategory : 'post',
        divisions : postDivision()
    }

    function postDivision(){
        var divisions = [];
        var division = {
            attributes : [],
            elements : []
        }
        division.elements.push(
            richTextElement({
                value : "编辑内容.."
            })
        );
        divisions.push(division);
        return divisions;
    }
}

function imageElement(params){
    var params = params ? params : {};
    var value = "http://placehold.it/200x200?text=image";
    params.attributes = params.attributes ? params.attributes : [];

    if(params.value){
        value = params.value;
    }
    var attributes = [
        { key : 'type', value : params.type ? params.type : 'image' },
        { key : 'linkUrl', value : params.linkUrl ? params.linkUrl : '' },
        { key : 'altText', value : params.altText ? params.altText : '' },
        { key : 'asBackground', value : params.asBackground ? params.asBackground : '' },
        { key : 'width', value : params.width ? params.width : '' },
        { key : 'height', value : params.height ? params.height : '' }
    ];

    return {
        key : '',
        value : value,
        attributes: _.union(attributes, params.attributes)
    }
}

function textElement(params){
    var params = params ? params : {};
    params.attributes = params.attributes ? params.attributes : [];
    return {
        key : "",
        value : params.value ? params.value : "text",
        attributes : _.union([{
            key : "type",
            value : params.type ? params.type : 'text'
        }], params.attributes)
    }
}

function richTextElement(params){
    var params = params ? params : {};
    params.attributes = params.attributes ? params.attributes : [];

    return {
        key : '',
        value : params.value ? params.value : 'text',
        attributes: _.union([{
            key : 'type',
            value : 'richtext'
        }], params.attributes)
    }
}

function newSection(params){
    var params = params ? params : {};
    var section = {
        attributes : [
        { 
            key : "head", 
            value : params.head ? params.head : "no"
        },
        { 
            key : "sectionCategory", 
            value : params.sectionCategory ? params.sectionCategory : ""
        },
        { 
            key : "title", 
            value : params.title ? params.title : ""
        },
        { 
            key : "sequence", 
            value : params.sequence ? params.sequence : "2"
        },
        { 
            key : "displayTitle", 
            value : params.displayTitle ? params.displayTitle : "yes"
        },
        {
            key : "width", 
            value : params.width ? params.width : "1000"
        },
        {
            key : "textAlign", 
            value : params.textAlign ? params.textAlign : "center"
        },
        {
            key : "carousel",
            value : params.carousel ? params.carousel : ""
        },{
            key : "cssKey", 
            value : params.cssKey ? params.cssKey : ""
        },{
            key : "eventSyncKey", 
            value : params.eventSyncKey ? params.eventSyncKey : ""
        },{
            key : "contentSync", 
            value : params.contentSync ? params.contentSync : ""
        },{
            key : "syncType", 
            value : params.syncType ? params.syncType : ""
        },{
            key : "syncSetKey", 
            value : params.syncSetKey ? params.syncSetKey : ""
        },{
            key : "syncSetValue", 
            value : params.syncSetValue ? params.syncSetValue : ""
        },{
            key : "linkUrl", 
            value : params.linkUrl ? params.linkUrl : "" 
        }],
        divisions : params.divisions ? params.divisions : []
    }
    return section;
}

module.exports = {
    generateChannel : generateChannel,
    generateSection : generateSection,
    isImageElement : isImageElement,
    isTextElement : isTextElement,
    isHtmlElement : isHtmlElement,
    isPersonElement : isPersonElement
}
},{}],17:[function(require,module,exports){
function getSection(sectionId, callback) {
	var url = flamingoRoot + '/flamingo-api/channel/section/' + sectionId;
	$.getJSON(url, {}, callback, callback);
}

function addSection(section, channelId, callback){
	var url = flamingoRoot + '/flamingo-api/channel/' + channelId + '/section/add';
    post(url, section, callback);
}

function getChannelsHead(indexKey, indexValue, callback){
	var url = flamingoRoot + '/flamingo-api/channel/set/channelsHead';
	var params = {
		indexKey : indexKey,
        indexValue : indexValue
	}
	$.getJSON(url, params, callback, callback);
}

function getChannel(channelId, callback){
	var url = flamingoRoot + '/flamingo-api/channel/' + channelId;

    $.ajax({
      url: url,
      cache: false,
      dataType: "json",
      success: callback,
      error: callback
    });
}

function getSectionsAttributes(indexKey, indexValue, callback){
	var params = {
		indexKey : indexKey,
        indexValue : indexValue
	}
	var url = flamingoRoot + '/flamingo-api/set/sections/attributes';
	$.getJSON(url, params, callback, callback);
}

function addChannel(indexKey, indexValue, channel, callback) {
	var url = flamingoRoot + '/flamingo-api/channel/set/addChannel' + '?indexKey=' + indexKey + '&indexValue=' + indexValue;
    post(url, channel, callback);
};

function updateElement (element, callback){
	var url = flamingoRoot + '/flamingo-api/channel/element/update/' +  element.elementId;
	post(url, {
        key : element.key,
        value : element.value
    }, callback);
}

function updateAttr(elementType, element, key, value){
    updateElementAttr(element, key, value);
    return updateAttrApi(elementType, element, key, value);
}

function updateChannelAttr (channelId, key, value, callback){
	var url = flamingoRoot + '/flamingo-api/channel/' + channelId + '/attrUpdate';
    post(url, {
        key : key,
        value : value
    }, callback);
}

function publish(html, path, callback){
	var url = flamingoRoot + '/flamingo-api/publish/v1';
	post(url, {
		path : path,
		html : html
	}, callback);
}

function post(url, data, callback){
	$.ajax({
	    type: "POST",
	    url: url,
	    // The key needs to match your method's input parameter (case-sensitive).
	    data: JSON.stringify(data),
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    success: callback,
	    failure: function(errMsg) {
	        callback(errMsg);
	    }
	});
}

module.exports = {
	getChannel : getChannel,
    getSection : getSection,
    getChannelsHead : getChannelsHead,
    getSectionsAttributes : getSectionsAttributes,
    addChannel : addChannel,
    addSection : addSection,
    updateElement : updateElement,
    updateChannelAttr : updateChannelAttr,
    publish : publish
}
},{}],18:[function(require,module,exports){
var channelService = require('./channelService');
var channelModelService = require('./channelModelService');

function syncSection(section, limit, callback){
    section.divisions = [];
    if(getAttr(section, 'syncType') == 'setHeads'){
        var syncSetKey = getAttr(section, 'syncSetKey');
        var syncSetValue = getAttr(section, 'syncSetValue');
        channelService.getChannelsHead(syncSetKey, syncSetValue, function(res){
            if(res.data){
                var sections = refine(res.data, limit);
                _.each(sections, function(head){
                    if(head.divisions[0]){
                        var division = head.divisions[0];
                        division.linkId = head.channelId;   
                        section.divisions.push(division);
                    }
                })
            }
            callback(section);
        })
    }else{
        callback();
    }
}

function syncSetSection(params, callback){
    var syncSetKey = params.setKey;
    var syncSetValue = params.setValue;
    var section = channelModelService.generateSection();

    channelService.getChannelsHead(syncSetKey, syncSetValue, function(res){
        if(res.data){
            var sections = refine(res.data, params.limit);
            _.each(sections, function(head){
                if(head.divisions[0]){
                    var division = head.divisions[0];
                    division.linkId = head.channelId;   
                    section.divisions.push(division);
                }
            })
        }
        callback(section);
    })
}

function getAttr(element, key){
    var attr = _.find(element.attributes, function(attr){
        return attr.key == key;
    })
    if(attr){
        return attr.value;
    }else{
        return "";
    }
}

function refine(sections, limit){
    sections = _.sortBy(sections, function(section){return -section.channelId});
    if(limit){
        sections = sections.splice(0, limit);
    }
    return sections;
}

module.exports = {
    syncSection : syncSection,
    syncSetSection : syncSetSection
}
},{"./channelModelService":16,"./channelService":17}],19:[function(require,module,exports){
function saveItem (key, item){
    localStorage.setItem(key, JSON.stringify(item));
}

function getItem (key){
    return JSON.parse(localStorage.getItem(key) || "{}");
}

function initUpload (config, error) {
    getQiniuUploadToken(function (res) {
        if (res.status == 'success') {
            if (config.length) {
                _.each(config, function (json) {
                    initQiniuUpload(res.data, json.btn, json.container, json.dropzone, json.progress, json.success, json.error);
                });
            }
            console.log('upload component init success...');
        } else {
            if (res.message) {
                error(res.message);
                console.log(res.message);
            }
            console.log('upload component init failed...');
        }
    });
};

function getQiniuUploadToken (callback) {
    var url = flamingoRoot + '/flamingo-api/qiniu/uptoken/';
    $.getJSON(url, {withCredentials: true}, callback, callback);
};

function initQiniuUpload(token, btn, container, dropzone, progress, success, error) {
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button: btn,       //上传选择的点选按钮，**必需**
        // downtoken_url: '/downtoken',
        // Ajax请求downToken的Url，私有空间时使用,JS-SDK将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
        uptoken: token, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://elbucket.qiniudn.com/',   //bucket 域名，下载资源时用到，**必需**
        container: container,           //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '100mb',           //最大文件体积限制
        flash_swf_url: 'lib/plupload/Moxie.swf',  //引入flash,相对路径
        max_retries: 3,                   //上传失败最大重试次数
        dragdrop: true,                   //开启可拖曳上传
        drop_element: dropzone,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传,
        //x_vals : {
        //    自定义变量，参考http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html
        //    'time' : function(up,file) {
        //        var time = (new Date()).getTime();
        // do something with 'time'
        //        return time;
        //    },
        //    'size' : function(up,file) {
        //        var size = file.size;
        // do something with 'size'
        //        return size;
        //    }
        //},
        init: {
            'FilesAdded': function (up, files) {
                plupload.each(files, function (file) {
                    // 文件添加进队列后,处理相关的事情
//                            console.log(1);

                });

            },
            'BeforeUpload': function (up, file) {
                // 每个文件上传前,处理相关的事情
//                        console.log(2);
            },
            'UploadProgress': function (up, file) {
                // 每个文件上传时,处理相关的事情
//                        console.log(file);
                progress(file.percent);
            },
            'FileUploaded': function (up, file, info) {
//                        console.log(4);
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

//                        console.log(up);
//                        console.log(file);
//                        console.log(info);

                var domain = up.getOption('domain');
                var res = JSON.parse(info);
                var sourceLink = domain + res.key; //获取上传成功后的文件的Url
                success(sourceLink);
                console.log(sourceLink);
            },
            'Error': function (up, err, errTip) {
                //上传出错时,处理相关的事情
//                        console.log(5);
//                        console.log(up);
//                        console.log(err);
                console.log(errTip);
                error(errTip);
            },
            'UploadComplete': function () {
                //队列文件处理完毕后,处理相关的事情
//                        console.log(6);
            },
            'Key': function (up, file) {
//                        console.log(7);
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效

                var key = "";
                // do something with key here
                return key;
            }
        }
    });
//            console.log(uploader);
}

module.exports = {
    saveItem : saveItem,
    getItem : getItem,
    initUpload : initUpload
}
},{}],20:[function(require,module,exports){

require('../lib/ejs');
var _templates = {};


    _templates.imageElementEdit = {"content":"<div class=\"popup-edit-panel\">    <div class=\"image-sample\" id=\"image-sample-container\">        <img style=\"max-width:240px;margin: 10px auto; display:block;\" src=\"<%=value%>\">    </div>    <p class=\"opt-btn upload\" id=\"image-upload-btn\">&#x672C;&#x5730;&#x4E0A;&#x4F20;</p>    <hr>    <p>&#x56FE;&#x7247;&#x5730;&#x5740;</p>       <div class=\"input-group\">        <input type=\"text\" class=\"form-control\" value=\"<%=value%>\">        <span class=\"save input-group-addon\">&#x4FDD;&#x5B58;</span>    </div></div>"};


    _templates.richtextElementEdit = {"content":"<div class=\"popup-edit-panel\"><script id=\"ue-container\" name=\"content\" type=\"text/plain\"><%=value%></script><p class=\"opt-btn save\">&#x4FDD;&#x5B58;</p><style type=\"text/css\">.edui-editor-iframeholder{min-height: 350px;}</style></div>"};


    _templates.textEditModal = {"content":"<div class=\"popup-edit-panel\"><p>&#x7F16;&#x8F91;&#x6587;&#x672C;</p><input type=\"text\" class=\"text-input\" value=\"<%=text%>\" style=\"width:100%;\"><p class=\"save opt-btn\">&#x4FDD;&#x5B58;</p></div>"};


    _templates.textElementEdit = {"content":"<div class=\"popup-edit-panel\"><p>&#x7F16;&#x8F91;&#x6587;&#x672C;</p><textarea class=\"element-value\" rows=\"5\" style=\"width:100%;\"></textarea><p class=\"opt-btn save\">&#x4FDD;&#x5B58;</p></div>"};


	_templates.channel = {"content":"<div class=\"americano-channel\"><div class=\"channel-options hide-when-publish\" style=\"display:none\"><p class=\"status-new opt-btn create-channel\">&#x65B0;&#x5EFA;</p><p class=\"status-edit opt-btn add-section\">&#x6DFB;&#x52A0;&#x6A21;&#x5757;</p><p class=\"status-edit opt-btn open\">&#x53D1;&#x5E03;</p></div><div class=\"section-pick-panel hide-when-publish\"></div><div class=\"head-section\"></div>        <div class=\"sections-container\"></div>        <div class=\"channel-style\"></div></div><style type=\"text/css\">.americano-channel{position: relative;margin: 15px auto;    max-width: 1000px;}.americano-channel .channel-title{position: absolute;left: 0;top: 10px;}.americano-channel .channel-options{border-bottom: 1px solid #aaa;text-align: right;margin-bottom: 10px;position: relative;}.americano-channel .channel-options .opt-btn{background: #2874E4;color: #fff;text-align: center;padding: 2px 16px;display: inline-block;cursor: pointer;margin: 10px;font-size: 12px;}.americano-channel .section-pick-panel{width: 100%;display: none;border-bottom: 1px solid #aaa;    margin-bottom: 15px;    padding-bottom: 10px;}.americano-channel .section-preview-item{width: 120px;display: inline-block;border: 1px solid #aaa;margin: 8px;padding: 4px;cursor: pointer;}.americano-channel .section-preview-item .desc{width: 100%;height: 60px;    overflow: hidden;}.americano-channel .section-preview-item .desc img{width: 100%;}#bpopup_content_g{width: 100%;}</style>"};


	_templates.division = {"content":"<div class=\"americano-division americano-<%= division.index %>-division\" id=\"americano-<%= division.divisionId %>-division\"><div class=\"division-container\"><div class=\"division-title\"></div>        <div class=\"elements-container\"></div>        <div class=\"division-style-container\"></div></div></div>"};


	_templates.element = {"content":"<div class=\"americano-element     am-<%=attrs.type%>-element    am-<%=attrs.index%>-element     am-<%=attrs.category%>-element\" id=\"am-<%=element.elementId%>-element\">    <div class=\"element-content\"></div>    <div class=\"element-style-container\"></div></div>"};


	_templates.htmlElement = {"content":"<%=html%></%=html%>"};


	_templates.imageElement = {"content":"<%=html%></%=html%>"};


	_templates.section = {"content":"<div class=\"americano-section\" id=\"am-<%= section.sectionId %>-section\"><div class=\"americano-section-container\"><div class=\"section-title-element\"></div>        <div class=\"divisions-container\"></div>        <div class=\"section-style-container\"></div></div></div>"};


	_templates.textElement = {"content":"<%=html%></%=html%>"};


	_templates.options = {"content":"<div class=\"channel-options-panels hide-when-publish\"><p class=\"publish\">&#x53D1;&#x5E03;</p><style type=\"text/css\">.channel-options-panels {position: fixed;top: 0;right: 0;z-index: 1000;background-color: #000;color: #fff;padding: 5px 20px;}.channel-options-panels p{margin: 0;cursor: pointer;}</style></div>"};


	_templates.sectionSnapshot = {"content":"<div class=\"section-preview-item\" sectionid=\"<%=sectionId%>\"><p class=\"title\"><%=title%></%=title%></p>        <div class=\"desc\"><%=html%></%=html%></div></div>"};


	_templates.style_clinghead_section = {"content":"<style type=\"text/css\">#am-<%=section.sectionId%>-section{max-width: 100%;}#am-<%=section.sectionId%>-section .divisions-container{overflow:hidden;position: relative;border-bottom: 1px solid #ddd;padding-bottom: 10px;}#am-<%=section.sectionId%>-section .americano-division{position: relative;margin-bottom: 15px;padding: 0;min-height: 68px;}#am-<%=section.sectionId%>-section .am-image-element{position: absolute;left: 10px;width: 124px;}#am-<%=section.sectionId%>-section .am-image-element .image-frame{width: 124px;height: 84px;}#am-<%=section.sectionId%>-section .am-itemtitle-element{padding-left:135px;width: 100%;}#am-<%=section.sectionId%>-section .am-description-element{padding-left:135px;width: 100%;}#am-<%=section.sectionId%>-section .am-itemtitle-element p{text-align: left;font-size: 16px;font-weight: bolder;padding: 0 10px;margin: 0;}#am-<%=section.sectionId%>-section .am-description-element p{text-align: left;font-size: 14px;padding: 2px 10px;}</style>"};


	_templates.style_division = {"content":"<style type=\"text/css\">#am-<%= division.divisionId %>-division{width: <%= divisionAttrs.width %>;text-align: <%= divisionAttrs.textAlign %>;}@media (max-width: 1000px){#am-<%= division.divisionId %>-division{width: <%= divisionAttrs.widthTablet %>;}}@media (max-width: 768px){#am-<%= division.divisionId %>-division{width: <%= divisionAttrs.widthMobile %>;}}</style>"};


	_templates.styleEditPanel = {"content":"<style type=\"text/css\">.popup-edit-panel{background: #fff;padding: 20px;width: 100%;margin: 0 auto;}.popup-edit-panel .save{margin-top: 12px;cursor: pointer;}#bpopup_content_g{position: fixed !important;width: 80%;max-width: 720px;max-height: 80%;z-index: 999 !important;}.__b-popup1__{z-index: 990 !important;}</style>"};


	_templates.style_element = {"content":"<style type=\"text/css\">#am-<%=element.elementId%>-element{width: <%=attrs.width%>;height: <%=attrs.height%>;}#am-<%=element.elementId%>-element .image-frame{width: <%=attrs.width%>;height: <%=attrs.height%>;}#am-<%=element.elementId%>-element p, #am-<%=element.elementId%>-element h3, #am-<%=element.elementId%>-element h5, #am-<%=element.elementId%>-element span{text-align: <%=attrs.textAlign%>;color: <%=attrs.color%>;font-size: <%=attrs.fontSize%>;}@media (max-width: 1000px){#am-<%=element.elementId%>-element{width: <%=attrs.widthTablet%>;}}@media (max-width: 768px){#am-<%=element.elementId%>-element{width: <%=attrs.widthMobile%>;}}.am-image-element .image-item{max-width: 100%;}.am-html-element iframe{width:100%;}</style>"};


	_templates.style_section = {"content":"<style type=\"text/css\">#am-<%= section.sectionId %>-section .divisions-container{}#am-<%= section.sectionId %>-section{background: <%= attrs.backgroundColor %>;}#am-<%= section.sectionId %>-section{background-image: url(<%= attrs.backgroundImg %>);background-position: 50% 50%;background-size: cover;}#am-<%= section.sectionId %>-section .section-title-element .am-text-element p{text-align: center;font-size: 24px;}</style>"};


	_templates.style_setlist_section = {"content":"<style type=\"text/css\">#am-<%=section.sectionId%>-section .divisions-container{overflow:hidden;position: relative;max-width:100%;}#am-<%=section.sectionId%>-section .americano-division{position: relative;margin-bottom: 15px;padding: 0;min-height: 100px;}#am-<%=section.sectionId%>-section .am-image-element{position: absolute;top: 0;left: 10px;width: 124px;}#am-<%=section.sectionId%>-section .am-image-element .image-frame{width: 124px;height: 84px;}#am-<%=section.sectionId%>-section .am-itemtitle-element{padding-left:135px;width: 100%;}#am-<%=section.sectionId%>-section .am-description-element{padding-left:135px;width: 100%;}#am-<%=section.sectionId%>-section .am-itemtitle-element p{text-align: left;font-size: 16px;font-weight: bolder;padding: 2px 10px;}#am-<%=section.sectionId%>-section .am-description-element p{text-align: left;font-size: 14px;padding: 2px 10px;}@media (max-width: 480px){#am-<%=section.sectionId%>-section .americano-division{border-bottom: 1px solid #ddd;margin: 0 auto 15px;width: 90%;padding:0;}#am-<%=section.sectionId%>-section .am-image-element{position: relative;left: 0px;width: 100%;}#am-<%=section.sectionId%>-section .am-image-element .image-frame{width: 100%;height: 146px;margin: 6px auto;}#am-<%=section.sectionId%>-section .am-itemtitle-element{padding:0px;width: 100%;}#am-<%=section.sectionId%>-section .am-description-element{padding:0px;width: 100%;}}</style>"};


	_templates.styleSlick = {"content":"<style type=\"text/css\">.slick-dots{text-align: center;position: absolute;bottom: 0;width: 100%;}.slick-dots li{display: inline-block;border-radius: 100%;    width: 8px;    height: 8px;    background: #999;    margin: 10px;}.slick-dots li button{display: none !important;}.slick-dotsli.slick-active{background: #ddd;}.slick-prev-arrow, .slick-next-arrow{cursor: pointer;z-index: 24;color: #FFF;    display: inline-block;    zoom: 1;opacity: 0.75;}.slick-prev-arrow{position: absolute;left: 0;top: 45%;}.slick-next-arrow{position: absolute;right: 0;top: 45%;}</style>"};


function render( obj,template) {
	if(!_templates[template]){
		console.log(template);
		return;
	}
	var template = new EJS({text: _templates[template].content});
    return template.render(obj);
}
module.exports = render;

},{"../lib/ejs":13}],21:[function(require,module,exports){
require ('../lib/sid');

var host = 'https://s3.cn-north-1.amazonaws.com.cn/channel.cdn/lib/';
// var host = location.origin + "/lib/";

window.CVM = window.CVM || {};

window.CVM.verdors = [{
		name : "underscore",
		source : [{
			type : "js",
			file : "underscore/underscore.min.js"
		}]
	},{
		name : "qiniu",
		source : [{
			type : "js",
			file : "qiniu/plupload.full.min.js"
		},{
			type : "js",
			file : "qiniu/qiniu.js"
		}]
	},{
		name : "bPopup",
		source : [{
			type : "js",
			file : "bPopup/bPopup.js"
		}]
	},{
		name : "ueditor",
		source : [{
			type : "js",
			file : "ueditor/ueditor.config.js"
		},{
			type : "js",
			file : "ueditor/ueditor.all.min.js"
		}]
	},{
		name : "slick",
		source : [{
			type : "js",
			file : "slick/slick.js"
		},{
			type : "css",
			file : "slick/slick.css"
		}]
	}
];

function prepare (name, callback){
	// var defers = [];
	var scripts = [];
	var css = [];
	var scriptDiv = $("#cvm-verdor-scripts").get(0) ? $("#cvm-verdor-scripts").get(0) : $("<div id='cvm-verdor-scripts'></div>").appendTo($("body"));

	for(var i = 0 ; i < window.CVM.verdors.length; i++){
		if(!window.CVM.verdors[i].loaded && matches(window.CVM.verdors[i].name, name)){
			var sources = window.CVM.verdors[i].source;
			for(var j = 0 ; j < sources.length; j++){
				if(sources[j].type == 'js'){
					var file = host +  sources[j].file;
					scripts.push(file);
				}
				else if(sources[j].type == 'css'){
					var file = host + sources[j].file;
					$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', file));
				}
			}
		}
	}
    Sid.js(scripts, function() {
    	callback();
	}, $(scriptDiv).get(0));
}

function updateVerdorStatus(name){
	for(var i = 0 ; i < window.CVM.verdors.length; i++){
		if(matches(window.CVM.verdors[i].name, name))
			window.CVM.verdors[i].loaded = true;
	}
}

function loadScript(url) {
	var defer = when.defer();
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                defer.resolve();
            }
        };
    } else { //Others
        script.onload = function () {
            defer.resolve();
        };
    }

    script.src = url;
    var scriptDiv = $("#cvm-verdor-scripts").get(0) ? $("#cvm-verdor-scripts").get(0) : $("<div id='cvm-verdor-scripts'></div>").appendTo($("body"));
    $(scriptDiv).append(script);
    return defer.promise;
}

function matches(name, require){
	if(typeof require == "string"){
		return name == require;
	}else{
		var result = false;
		for(var i = 0 ; i < require.length; i++){
			if(require[i] == name)
				result = true;
		}
		return result;
	}
}

module.exports = prepare;
},{"../lib/sid":14}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjdm0vanMvY3ZtLmpzIiwiY3ZtL2pzL2VmZmVjdC9jYXJvdXNlbC5qcyIsImN2bS9qcy9lZmZlY3Qvb3B0aW9ucy5qcyIsImN2bS9qcy9lZmZlY3QvcG9wVXAuanMiLCJjdm0vanMvZWxlX2NoYW5uZWwuanMiLCJjdm0vanMvZWxlX2RpdmlzaW9uLmpzIiwiY3ZtL2pzL2VsZV9lbGVtZW50LmpzIiwiY3ZtL2pzL2VsZV9odG1sRWxlbWVudC5qcyIsImN2bS9qcy9lbGVfaW1hZ2VFbGVtZW50LmpzIiwiY3ZtL2pzL2VsZV9zZWN0aW9uLmpzIiwiY3ZtL2pzL2VsZV9zZXQuanMiLCJjdm0vanMvZWxlX3RleHRFbGVtZW50LmpzIiwiY3ZtL2pzL2xpYi9lanMuanMiLCJjdm0vanMvbGliL3NpZC5qcyIsImN2bS9qcy9saWIvdXJpLmpzIiwiY3ZtL2pzL3NlcnZpY2UvY2hhbm5lbE1vZGVsU2VydmljZS5qcyIsImN2bS9qcy9zZXJ2aWNlL2NoYW5uZWxTZXJ2aWNlLmpzIiwiY3ZtL2pzL3NlcnZpY2UvY2hhbm5lbFN5bmNTZXJ2aWNlLmpzIiwiY3ZtL2pzL3NlcnZpY2UvY2hhbm5lbFV0aWxTZXJ2aWNlLmpzIiwiY3ZtL2pzL3NlcnZpY2UvdGVtcGxhdGVSZW5kZXIuanMiLCJjdm0vanMvc2VydmljZS92ZXJkb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNoYW5uZWxTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZXJ2aWNlL2NoYW5uZWxTZXJ2aWNlJyk7XG52YXIgdmVyZG9yID0gcmVxdWlyZShcIi4vc2VydmljZS92ZXJkb3JcIik7XG52YXIgQ2hhbm5lbCA9IHJlcXVpcmUoJy4vZWxlX2NoYW5uZWwnKTtcbnZhciBTZWN0aW9uID0gcmVxdWlyZSgnLi9lbGVfc2VjdGlvbicpO1xudmFyIFNldFNlY3Rpb24gPSByZXF1aXJlKCcuL2VsZV9zZXQnKTtcbnZhciBDYXJvdXNlbCA9IHJlcXVpcmUoJy4vZWZmZWN0L2Nhcm91c2VsJyk7XG52YXIgT3B0aW9ucyA9IHJlcXVpcmUoJy4vZWZmZWN0L29wdGlvbnMnKTtcbnJlcXVpcmUoJy4vbGliL3VyaScpO1xuXG52YXIgcHJvZEZsYW1pbmdvVXJsID0gJ2h0dHA6Ly9wcm9kLWZsYW1pbmdvLTE0NDg4ODk2MTQuY24tbm9ydGgtMS5lbGIuYW1hem9uYXdzLmNvbS5jbjo4MDg1JztcbnZhciBzdGFnaW5nRmxhbWluZ29VcmwgPSAnaHR0cDovL3N0YWdpbmcuZXZlbnRzbGluLmNvbTo4MDgwJztcbnZhciBkZXZGbGFnbWluZ29VcmwgPSAnaHR0cDovL2xvY2FsaG9zdDo4MDg1Jztcblxuc2V0Um9vdFVybChwcm9kRmxhbWluZ29VcmwpO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgc2V0TW9kZSgpO1xuICAgIHZlcmRvcigndW5kZXJzY29yZScsIGluaXQpO1xuXG4gICAgd2luZG93LkNWTXNldCA9IGZ1bmN0aW9uKGVsZSl7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICBzZXRLZXkgOiAkKGVsZSkuYXR0cignc2V0a2V5JyksXG4gICAgICAgICAgICBzZXRWYWx1ZSA6ICQoZWxlKS5hdHRyKCdzZXR2YWx1ZScpLFxuICAgICAgICAgICAgbGltaXQgOiAkKGVsZSkuYXR0cignbGltaXQnKSxcbiAgICAgICAgICAgIGxpbmsgOiAkKGVsZSkuYXR0cignbGluaycpLFxuICAgICAgICAgICAgZGl2aXNpb25MaW5rIDogJChlbGUpLmF0dHIoJ2RpdmlzaW9uLWxpbmsnKSxcbiAgICAgICAgICAgIHN0YXRpY1JlbmRlciA6ICQoZWxlKS5hdHRyKCdzdGF0aWMnKSA9PSAndHJ1ZSdcbiAgICAgICAgfVxuICAgICAgICBTZXRTZWN0aW9uKHBhcmFtcywgJChlbGUpKTtcbiAgICB9XG59KVxuXG5mdW5jdGlvbiBpbml0KHJlcyl7XG4gICAgJChcIltibXktc2VjdGlvbl1cIikuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICAgICAgbGltaXQgOiAkKHRoaXMpLmF0dHIoJ2xpbWl0JyksXG4gICAgICAgICAgICBzZWN0aW9uSWQgOiAkKHRoaXMpLmF0dHIoJ3NlY3Rpb25pZCcpLFxuICAgICAgICAgICAgbGluayA6ICQodGhpcykuYXR0cignbGluaycpLFxuICAgICAgICAgICAgZGl2aXNpb25MaW5rIDogJCh0aGlzKS5hdHRyKCdkaXZpc2lvbi1saW5rJyksXG4gICAgICAgICAgICBzdGF0aWNSZW5kZXIgOiAkKHRoaXMpLmF0dHIoJ3N0YXRpYycpID09ICd0cnVlJ1xuICAgICAgICB9XG4gICAgICAgIFNlY3Rpb24ocGFyYW1zLCB0aGlzKTtcbiAgICB9KVxuXG4gICAgJChcIltibXktY2hhbm5lbF1cIikuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICAgICAgaGVhZCA6ICQodGhpcykuYXR0cignaGVhZCcpLFxuICAgICAgICAgICAgc2V0S2V5IDogJCh0aGlzKS5hdHRyKCdzZXRrZXknKSxcbiAgICAgICAgICAgIHNldFZhbHVlIDogJCh0aGlzKS5hdHRyKCdzZXR2YWx1ZScpLFxuICAgICAgICAgICAgc3RhdGljUmVuZGVyIDogJCh0aGlzKS5hdHRyKCdzdGF0aWMnKSA9PSAndHJ1ZSdcbiAgICAgICAgfVxuICAgICAgICBpZigkKHRoaXMpLmF0dHIoJ2NoYW5uZWxpZCcpKXtcbiAgICAgICAgICAgIHBhcmFtcy5jaGFubmVsSWQgPSAkKHRoaXMpLmF0dHIoJ2NoYW5uZWxpZCcpO1xuICAgICAgICB9XG4gICAgICAgIENoYW5uZWwocGFyYW1zLCB0aGlzKTtcbiAgICB9KVxuXG4gICAgJChcIltibXktY2Fyb3VzZWwtZ2VuID0gJ3RydWUnXVwiKS5yZW1vdmUoKTtcblxuICAgICQoXCJbYm15LWNhcm91c2VsXVwiKS5lYWNoKGZ1bmN0aW9uKCl7IFxuICAgICAgICB2YXIgcGFyYW1zID0ge1xuICAgICAgICAgICAgYXV0b3BsYXkgOiAkKHRoaXMpLmF0dHIoJ2F1dG9wbGF5JykgIT0gdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgICAgQ2Fyb3VzZWwocGFyYW1zLCAkKHRoaXMpKTtcbiAgICB9KVxuXG4gICAgJChcIltibXktbGlua11cIikuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAkKHRoaXMpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gJCh0aGlzKS5hdHRyKCdibXktbGluaycpO1xuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICAkKFwiW2JteS1zZXRdXCIpLmVhY2goZnVuY3Rpb24oKXsgXG4gICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICBzZXRLZXkgOiAkKHRoaXMpLmF0dHIoJ3NldGtleScpLFxuICAgICAgICAgICAgc2V0VmFsdWUgOiAkKHRoaXMpLmF0dHIoJ3NldHZhbHVlJyksXG4gICAgICAgICAgICBsaW1pdCA6ICQodGhpcykuYXR0cignbGltaXQnKSxcbiAgICAgICAgICAgIGxpbmsgOiAkKHRoaXMpLmF0dHIoJ2xpbmsnKSxcbiAgICAgICAgICAgIGRpdmlzaW9uTGluayA6ICQodGhpcykuYXR0cignZGl2aXNpb24tbGluaycpLFxuICAgICAgICAgICAgc3RhdGljUmVuZGVyIDogJCh0aGlzKS5hdHRyKCdzdGF0aWMnKSA9PSAndHJ1ZSdcbiAgICAgICAgfVxuICAgICAgICBTZXRTZWN0aW9uKHBhcmFtcywgJCh0aGlzKSk7XG4gICAgfSlcblxuICAgIGlmKHdpbmRvdy5DVk0ubW9kZSA9PSAnZWRpdCcpe1xuICAgICAgICBPcHRpb25zKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZXRNb2RlKCl7IFxuICAgIHdpbmRvdy5DVk0gPSB3aW5kb3cuQ1ZNIHx8IHt9O1xuICAgIHdpbmRvdy5DVk0ubW9kZSA9IFwidmlld1wiO1xuXG4gICAgaWYoJChcImJvZHlcIikuYXR0cihcImJteS1hY3RpdmUtdXJsa2V5XCIpICE9IFwiXCIpe1xuICAgICAgICB2YXIgYWN0aXZlVXJsS2V5ID0gJChcImJvZHlcIikuYXR0cihcImJteS1hY3RpdmUtdXJsa2V5XCIpO1xuICAgICAgICBpZigkLmdldFF1ZXJ5KGFjdGl2ZVVybEtleSkgPT0gXCJ0cnVlXCIpe1xuICAgICAgICAgICAgd2luZG93LkNWTS5tb2RlID0gXCJlZGl0XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYoJChcImJvZHlcIikuYXR0cihcImJteS1hY3RpdmVcIikgPT0gXCJ0cnVlXCIpe1xuICAgICAgICB3aW5kb3cuQ1ZNLm1vZGUgPSBcImVkaXRcIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldFJvb3RVcmwodXJsKXtcbiAgICB3aW5kb3cuZmxhbWluZ29Sb290ID0gdXJsO1xufVxuXG4iLCJ2YXIgdGVtcGxhdGVSZW5kZXIgPSByZXF1aXJlKFwiLi4vc2VydmljZS90ZW1wbGF0ZVJlbmRlclwiKTtcbnZhciB2ZXJkb3IgPSByZXF1aXJlKFwiLi4vc2VydmljZS92ZXJkb3JcIik7XG5cbmZ1bmN0aW9uIGNhcm91c2VsIChwYXJhbXMsIGNvbnRhaW5lcikge1xuICAgIHZlcmRvcignc2xpY2snLCByZW5kZXIpO1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyKCl7XG4gICAgICAgICQoY29udGFpbmVyKS5oaWRlKCk7XG4gICAgICAgIHZhciBzbGlja0dlbiA9ICQoY29udGFpbmVyKS5jbG9uZSgpLmF0dHIoXCJibXktY2Fyb3VzZWwtZ2VuXCIsICd0cnVlJykuaW5zZXJ0QWZ0ZXIoJChjb250YWluZXIpKS5zaG93KCk7XG4gICAgICAgICQoc2xpY2tHZW4pLnNsaWNrKHtcbiAgICAgICAgICAgIGxhenlMb2FkIDogdHJ1ZSxcbiAgICAgICAgICAgIHByZXZBcnJvdyA6IFwiPGRpdiBjbGFzcz0nc2xpY2stcHJldi1hcnJvdyc+PGltZyBzcmM9J2h0dHBzOi8vczMuY24tbm9ydGgtMS5hbWF6b25hd3MuY29tLmNuL2NoYW5uZWwuY2RuL2ltZy9sZWZ0LnBuZyc+PC9kaXY+XCIsXG4gICAgICAgICAgICBuZXh0QXJyb3cgOiBcIjxkaXYgY2xhc3M9J3NsaWNrLW5leHQtYXJyb3cnPjxpbWcgc3JjPSdodHRwczovL3MzLmNuLW5vcnRoLTEuYW1hem9uYXdzLmNvbS5jbi9jaGFubmVsLmNkbi9pbWcvcmlnaHQucG5nJz48L2Rpdj5cIixcbiAgICAgICAgICAgIGF1dG9wbGF5IDogcGFyYW1zLmF1dG9wbGF5LFxuICAgICAgICAgICAgZG90cyA6IHRydWUsXG4gICAgICAgICAgICB6SW5kZXggOiAyMFxuICAgICAgICB9KTsgXG5cbiAgICAgICAgaWYoJChcIiNnbG9iYWwtc2xpY2stY2Fyb3VzZWxcIikubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgJChcIjxkaXYgaWQ9J2dsb2JhbC1zbGljay1jYXJvdXNlbCc+PC9kaXY+XCIpLmh0bWwodGVtcGxhdGVSZW5kZXIoe30sICdzdHlsZVNsaWNrJykpLmFwcGVuZFRvKCQoXCJib2R5XCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXJvdXNlbDsiLCJ2YXIgdGVtcGxhdGVSZW5kZXIgPSByZXF1aXJlKFwiLi4vc2VydmljZS90ZW1wbGF0ZVJlbmRlclwiKTtcbnZhciBjaGFubmVsU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2UvY2hhbm5lbFNlcnZpY2UnKTtcblxuZnVuY3Rpb24gb3B0aW9ucygpe1xuICAgICQodGVtcGxhdGVSZW5kZXIoe30sICdvcHRpb25zJykpLmFwcGVuZFRvKCQoJ2JvZHknKSk7XG4gICAgdmFyIHdlYnNpdGUgPSAkKFwiYm9keVwiKS5hdHRyKCdibXktd2Vic2l0ZScpO1xuICAgIHZhciBwYWdlID0gJChcImJvZHlcIikuYXR0cignYm15LXBhZ2UnKTtcblxuICAgICQoXCIuY2hhbm5lbC1vcHRpb25zLXBhbmVscyAucHVibGlzaFwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgaHRtbCA9IHByZXBhcmVQdWJsaXNoSHRtbCgpOyAgXG4gICAgICAgIGNoYW5uZWxTZXJ2aWNlLnB1Ymxpc2goaHRtbCwgXCJ3ZWJzaXRlL1wiICsgd2Vic2l0ZSArICcvJyArIHBhZ2UgKyAnL2luZGV4Lmh0bWwnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgYWxlcnQoXCLlj5HluIPmiJDlip9cIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlUHVibGlzaEh0bWwoKXtcbiAgICAkKFwiLmhpZGUtd2hlbi1wdWJsaXNoXCIpLnJlbW92ZSgpO1xuICAgICQoXCIjY3ZtLXZlcmRvci1zY3JpcHRzXCIpLnJlbW92ZSgpO1xuICAgIHJldHVybiBcIjwhRE9DVFlQRSBodG1sPjxodG1sIGxhbmc9J3poJz5cIiArICQoXCJodG1sXCIpLmh0bWwoKSArIFwiPC9odG1sPlwiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9wdGlvbnM7IiwidmFyIGNoYW5uZWxVdGlsU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2UvY2hhbm5lbFV0aWxTZXJ2aWNlJyk7XG52YXIgdGVtcGxhdGVSZW5kZXIgPSByZXF1aXJlKFwiLi4vc2VydmljZS90ZW1wbGF0ZVJlbmRlclwiKTtcbnZhciB2ZW5kb3IgPSByZXF1aXJlKFwiLi4vc2VydmljZS92ZXJkb3JcIik7XG5cbnZhciBlZGl0UGFuZWxTdHlsZSA9IHRlbXBsYXRlUmVuZGVyKHt9LCAnc3R5bGVFZGl0UGFuZWwnKTtcbnZhciBwb3B1cDtcblxuZnVuY3Rpb24gcG9wVXAocGFyYW1zKSB7XG4gICAgdmVuZG9yKFsnYlBvcHVwJywgJ3VlZGl0b3InLCAncWluaXUnXSwgcmVuZGVyKTtcblxuICAgIGZ1bmN0aW9uIHJlbmRlcigpe1xuICAgICAgICAkKCc8ZGl2IGlkPVwiYnBvcHVwX2NvbnRlbnRfZ1wiPicgKyBwYXJhbXMuY29udGVudCArIGVkaXRQYW5lbFN0eWxlICsgJzwvZGl2PicpLmFwcGVuZFRvKCQoXCJib2R5XCIpKS5oaWRlKCk7XG5cbiAgICAgICAgcG9wdXAgPSAkKCcjYnBvcHVwX2NvbnRlbnRfZycpLmJQb3B1cCh7XG4gICAgICAgICAgICBwb3NpdGlvbiA6IFsnYXV0bycsIDIwXSxcbiAgICAgICAgICAgIG9uQ2xvc2UgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAkKFwiYm9keVwiKS5maW5kKFwiI2Jwb3B1cF9jb250ZW50X2dcIikucmVtb3ZlKCk7ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmKHBhcmFtcy5pbml0VWVkaXRvcil7XG4gICAgICAgICAgICBpbml0VWVkaXRvcihwYXJhbXMuaW5pdFVlZGl0b3IpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHBhcmFtcy5pbml0SW1hZ2VVcGxvYWQpe1xuICAgICAgICAgICAgaW5pdEltYWdlVXBsb2FkKHBhcmFtcy5pbml0SW1hZ2VVcGxvYWQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBiaW5kKHBhcmFtcy5iaW5kKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGJpbmQoYmluZHMpe1xuICAgIF8uZWFjaChiaW5kcywgZnVuY3Rpb24oYil7XG4gICAgICAgICQoJyNicG9wdXBfY29udGVudF9nJykuZmluZChiLmVsZW1lbnQpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBiLmNhbGxiYWNrKCQoJyNicG9wdXBfY29udGVudF9nJyksIGZ1bmN0aW9uKGNsb3NlKXtcbiAgICAgICAgICAgICAgICBpZihjbG9zZSl7XG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsb3NlKCk7IFxuICAgICAgICAgICAgICAgICAgICAkKFwiI2Jwb3B1cF9jb250ZW50X2dcIikucmVtb3ZlKCk7ICAgIFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gaW5pdFVlZGl0b3IoZWxlKXtcbiAgICBVRS5kZWxFZGl0b3IoZWxlKTtcbiAgICBVRS5nZXRFZGl0b3IoZWxlLCB7XG4gICAgICAgIGF1dG9IZWlnaHRFbmFibGVkOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgJChcIiN1ZS1jb250YWluZXIgLmVkdWktZWRpdG9yLWlmcmFtZWhvbGRlciBpZnJhbWVcIikuY29udGVudHMoKS5maW5kKFwiYm9keVwiKS5jc3Moe1wiaGVpZ2h0XCI6XCIzMDBweFwiLCBcIm92ZXJmbG93LXlcIjpcInNjcm9sbFwifSk7XG59XG5cbmZ1bmN0aW9uIGluaXRJbWFnZVVwbG9hZChwYXJhbXMpIHtcbiAgICBjaGFubmVsVXRpbFNlcnZpY2UuaW5pdFVwbG9hZChbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGJ0bjogcGFyYW1zLmJ0bixcbiAgICAgICAgICAgIGNvbnRhaW5lcjogcGFyYW1zLmNvbnRhaW5lcixcbiAgICAgICAgICAgIHByb2dyZXNzOnBhcmFtcy5wcm9ncmVzcyAsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmZpbmlzaCh1cmwsIGZ1bmN0aW9uKGNsb3NlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2xvc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xvc2UoKTsgXG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiI2Jwb3B1cF9jb250ZW50X2dcIikucmVtb3ZlKCk7ICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlKSB7fVxuICAgICAgICB9XG4gICAgXSwgZnVuY3Rpb24gKGVycm9yTWVzc2FnZSkge30pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBvcFVwOyIsInZhciBjaGFubmVsU2VydmljZSA9IHJlcXVpcmUoJy4vc2VydmljZS9jaGFubmVsU2VydmljZScpO1xudmFyIHRlbXBsYXRlUmVuZGVyID0gcmVxdWlyZShcIi4vc2VydmljZS90ZW1wbGF0ZVJlbmRlclwiKTtcbnZhciBjaGFubmVsTW9kZWxTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZXJ2aWNlL2NoYW5uZWxNb2RlbFNlcnZpY2UnKTtcbnZhciBTZWN0aW9uID0gcmVxdWlyZSgnLi9lbGVfc2VjdGlvbicpO1xudmFyIHBvcFVwID0gcmVxdWlyZSgnLi9lZmZlY3QvcG9wVXAnKTtcblxuZnVuY3Rpb24gIENoYW5uZWwocGFyYW1zLCBjb250YWluZXIpIHtcbiAgICB2YXIgY2hhbm5lbElkO1xuICAgIGlmKHBhcmFtcy5jaGFubmVsSWQpe1xuICAgICAgICBjaGFubmVsSWQgPSBwYXJhbXMuY2hhbm5lbElkO1xuICAgIH1lbHNlIGlmKCQuZ2V0UXVlcnkoJ2lkJykpe1xuICAgICAgICBjaGFubmVsSWQgPSAkLmdldFF1ZXJ5KCdpZCcpO1xuICAgIH1cblxuXHR2YXIgc2NvcGUgPSB7XG4gICAgICAgIGNoYW5uZWwgOiBudWxsLFxuICAgICAgICBjaGFubmVsSWQgOiBjaGFubmVsSWQsXG5cdFx0YXR0cnMgOiB7fSxcblx0XHR0aXRsZUVsZW1lbnQgOiBudWxsLFxuICAgICAgICBzaG93aGVhZCA6IHBhcmFtcy5zaG93aGVhZCAhPSAnbm8nLFxuICAgICAgICBzZXRLZXkgOiBwYXJhbXMuc2V0S2V5LFxuICAgICAgICBzZXRWYWx1ZSA6IHBhcmFtcy5zZXRWYWx1ZSxcbiAgICAgICAgbW9kZSA6IHdpbmRvdy5DVk0ubW9kZVxuXHR9O1xuXG4gICAgaWYocGFyYW1zLnN0YXRpY1JlbmRlciAmJiBzY29wZS5tb2RlICE9ICdlZGl0JylcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgJGNvbnRhaW5lciA9ICQoY29udGFpbmVyKTtcbiAgICAkY29udGFpbmVyLmZpbmQoXCIuc2VjdGlvbnMtY29udGFpbmVyXCIpLnJlbW92ZSgpO1xuICAgICRjb250YWluZXIuZmluZChcIi5oZWFkLXNlY3Rpb25cIikucmVtb3ZlKCk7XG5cbiAgICB2YXIgJGVsZSA9ICQodGVtcGxhdGVSZW5kZXIoc2NvcGUsICdjaGFubmVsJykpLmFwcGVuZFRvKCRjb250YWluZXIpO1xuICAgIGJpbmQoKTtcblxuICAgIGZldGNoKCk7XG5cbiAgICBpZihzY29wZS5tb2RlID09ICdlZGl0Jyl7XG4gICAgICAgIHByZXBhcmVQdWJsaWNTZWN0aW9ucygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZldGNoKGNhbGxiYWNrKXtcbiAgICAgICAgaWYoc2NvcGUuY2hhbm5lbElkKXtcbiAgICAgICAgICAgIGNoYW5uZWxTZXJ2aWNlLmdldENoYW5uZWwoc2NvcGUuY2hhbm5lbElkLCBmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgIHNjb3BlLmNoYW5uZWwgPSByZXMuZGF0YTtcbiAgICAgICAgICAgICAgICBzY29wZS50aXRsZSA9IGdldEF0dHIoc2NvcGUuY2hhbm5lbCwgJ3RpdGxlJykgPyBnZXRBdHRyKHNjb3BlLmNoYW5uZWwsICd0aXRsZScpIDogXCLmoIfpophcIjtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IHNjb3BlLnRpdGxlO1xuICAgICAgICAgICAgICAgICRjb250YWluZXIuYXR0cignY2hhbm5lbGlkJywgY2hhbm5lbElkKTtcbiAgICAgICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiByZW5kZXIoKXtcbiAgICAgICAgcmVuZGVyQ2hhbm5lbCgpO1xuICAgICAgICByZW5kZXJPcHRpb25zKCk7XG4gICAgICAgIHJlbmRlckF0dHJGaWVsZCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlckNoYW5uZWwoKXtcbiAgICAgICAgJGVsZS5maW5kKFwiLnNlY3Rpb25zLWNvbnRhaW5lclwiKS5lbXB0eSgpO1xuICAgICAgICAkZWxlLmZpbmQoXCIuaGVhZC1zZWN0aW9uXCIpLmVtcHR5KCk7XG4gICAgICAgIGlmKCFzY29wZS5jaGFubmVsKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIF8uZWFjaChzY29wZS5jaGFubmVsLnNlY3Rpb25zLCBmdW5jdGlvbihzZWN0aW9uKXtcbiAgICAgICAgICAgIGlmKGdldEF0dHIoc2VjdGlvbiAsICdoZWFkJykgPT0gJ3llcycpe1xuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGUgOiBzY29wZS5tb2RlLFxuICAgICAgICAgICAgICAgICAgICBzZWN0aW9uIDogc2VjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBTZWN0aW9uKHBhcmFtcywgJGVsZS5maW5kKFwiLmhlYWQtc2VjdGlvblwiKSk7XG4gICAgICAgICAgICAgICAgaWYoc2NvcGUuc2hvd2hlYWQgIT0gJ3llcycgJiYgc2NvcGUubW9kZSA9PSAndmlldycpe1xuICAgICAgICAgICAgICAgICAgICAkZWxlLmZpbmQoXCIuaGVhZC1zZWN0aW9uXCIpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoc2NvcGUuc2hvd2hlYWQgIT0gJ3llcycgJiYgc2NvcGUubW9kZSA9PSAnZWRpdCcpe1xuICAgICAgICAgICAgICAgICAgICAkZWxlLmZpbmQoXCIuaGVhZC1zZWN0aW9uXCIpLmFkZENsYXNzKCdoaWRlLXdoZW4tcHVibGlzaCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGUgOiBzY29wZS5tb2RlLFxuICAgICAgICAgICAgICAgICAgICBzZWN0aW9uIDogc2VjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc2VjdGlvbkNvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XCJzZWN0aW9uLWl0ZW1cIj48L2Rpdj4nKS5hcHBlbmRUbygkZWxlLmZpbmQoXCIuc2VjdGlvbnMtY29udGFpbmVyXCIpKTtcbiAgICAgICAgICAgICAgICBTZWN0aW9uKHBhcmFtcywgc2VjdGlvbkNvbnRhaW5lcik7ICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlckF0dHJGaWVsZCgpe1xuICAgICAgICBpZighc2NvcGUuY2hhbm5lbClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAkKFwiW2JteS1jaGFubmVsLWF0dHJdXCIpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBrZXkgPSAkKHRoaXMpLmF0dHIoJ2JteS1jaGFubmVsLWF0dHInKTtcbiAgICAgICAgICAgIGlmKGtleSl7XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSBnZXRBdHRyKHNjb3BlLmNoYW5uZWwsIGtleSkgPyBnZXRBdHRyKHNjb3BlLmNoYW5uZWwsIGtleSkgOiBrZXk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS50ZXh0KHRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJPcHRpb25zKCl7XG4gICAgICAgIGlmKHNjb3BlLm1vZGUgPT0gJ2VkaXQnKXtcbiAgICAgICAgICAgICQoXCIuY2hhbm5lbC1vcHRpb25zXCIpLnNob3coKTtcbiAgICAgICAgICAgIGlmKCFzY29wZS5jaGFubmVsSWQpe1xuICAgICAgICAgICAgICAgICQoXCIuc3RhdHVzLW5ld1wiKS5jc3MoJ2Rpc3BsYXknLCAnaW5saW5lLWJsb2NrJyk7XG4gICAgICAgICAgICAgICAgJChcIi5zdGF0dXMtZWRpdFwiKS5oaWRlKCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAkKFwiLnN0YXR1cy1uZXdcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgICQoXCIuc3RhdHVzLWVkaXRcIikuY3NzKCdkaXNwbGF5JywgJ2lubGluZS1ibG9jaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZSBpZihzY29wZS5tb2RlID09ICd2aWV3Jyl7XG4gICAgICAgICAgICAkKFwiLmNoYW5uZWwtb3B0aW9uc1wiKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiaW5kKCl7XG4gICAgICAgICRjb250YWluZXIuZmluZChcIltibXktY2hhbm5lbC1hdHRyXVwiKS5jbGljayhlZGl0Q2hhbm5lbEF0dHIpO1xuICAgICAgICAkKFwiLmNoYW5uZWwtb3B0aW9ucyAuY3JlYXRlLWNoYW5uZWxcIikuY2xpY2soY3JlYXRlQ2hhbm5lbCk7XG4gICAgICAgICQoXCIuY2hhbm5lbC1vcHRpb25zIC5hZGQtc2VjdGlvblwiKS5jbGljayh0b2dnbGVQaWNrU2VjdGlvbik7XG4gICAgICAgICQoXCIuY2hhbm5lbC1vcHRpb25zIC5vcGVuXCIpLmNsaWNrKHB1Ymxpc2gpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXBhcmVQdWJsaWNTZWN0aW9ucygpe1xuICAgICAgICBjaGFubmVsU2VydmljZS5nZXRTZWN0aW9uc0F0dHJpYnV0ZXMoJ2V2ZW50c2xpbkFkbWluQ29udGVudCcsICdwdWJsaWNCdWlsZGluZ1NlY3Rpb24nLCBmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgc2NvcGUucHVibGljQnVpbGRpbmdTZWN0aW9ucyA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgXy5lYWNoKHNjb3BlLnB1YmxpY0J1aWxkaW5nU2VjdGlvbnMsIGZ1bmN0aW9uKHNlY3Rpb24pe1xuICAgICAgICAgICAgICAgICQodGVtcGxhdGVSZW5kZXIoe3RpdGxlOnNlY3Rpb24udGl0bGUsaHRtbDpzZWN0aW9uLmRlc2NIdG1sLHNlY3Rpb25JZDpzZWN0aW9uLnNlY3Rpb25JZH0sICdzZWN0aW9uU25hcHNob3QnKSkuYXBwZW5kVG8oJChcIi5zZWN0aW9uLXBpY2stcGFuZWxcIikpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICQoXCIuc2VjdGlvbi1waWNrLXBhbmVsIC5zZWN0aW9uLXByZXZpZXctaXRlbVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBzZWN0aW9uSWQgPSAkKHRoaXMpLmF0dHIoJ3NlY3Rpb25pZCcpO1xuICAgICAgICAgICAgICAgIGluc2VydFNlY3Rpb24oc2VjdGlvbklkKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pOyBcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVQaWNrU2VjdGlvbigpe1xuICAgICAgICAkKFwiLnNlY3Rpb24tcGljay1wYW5lbFwiKS50b2dnbGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnNlcnRTZWN0aW9uKHNlY3Rpb25JZCl7XG4gICAgICAgIGNoYW5uZWxTZXJ2aWNlLmdldFNlY3Rpb24oc2VjdGlvbklkLCBmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgY2hhbm5lbFNlcnZpY2UuYWRkU2VjdGlvbihyZXMuZGF0YSwgc2NvcGUuY2hhbm5lbC5jaGFubmVsSWQsIGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgY2hhbm5lbFNlcnZpY2UuZ2V0Q2hhbm5lbChzY29wZS5jaGFubmVsLmNoYW5uZWxJZCwgZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2hhbm5lbCA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgICAgICAgICByZW5kZXIoKTsgXG4gICAgICAgICAgICAgICAgICAgICQoXCIuc2VjdGlvbi1waWNrLXBhbmVsXCIpLnRvZ2dsZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwdWJsaXNoKCl7XG4gICAgICAgIGNoYW5uZWxTZXJ2aWNlLnVwZGF0ZUNoYW5uZWxBdHRyKHNjb3BlLmNoYW5uZWwuY2hhbm5lbElkLCAnc3RhdHVzJywgJ29wZW4nLCBmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgdmFyIGh0bWwgPSBwcmVwYXJlUHVibGlzaEh0bWwoKTsgIFxuICAgICAgICAgICAgdmFyIHdlYnNpdGUgPSAkKFwiYm9keVwiKS5hdHRyKCdibXktd2Vic2l0ZScpO1xuICAgICAgICAgICAgdmFyIHBhZ2UgPSAkKFwiYm9keVwiKS5hdHRyKCdibXktcGFnZScpO1xuICAgICAgICAgICAgY2hhbm5lbFNlcnZpY2UucHVibGlzaChodG1sLCBcIndlYnNpdGUvXCIgKyB3ZWJzaXRlICsgJy8nICsgcGFnZSArICcvJyArIHNjb3BlLmNoYW5uZWwuY2hhbm5lbElkICsgJy5odG1sJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBhbGVydChcIuWPkeW4g+aIkOWKn1wiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVwYXJlUHVibGlzaEh0bWwoKXtcbiAgICAgICAgJChcIi5oaWRlLXdoZW4tcHVibGlzaFwiKS5yZW1vdmUoKTtcbiAgICAgICAgJChcIiNjdm0tdmVyZG9yLXNjcmlwdHNcIikucmVtb3ZlKCk7XG4gICAgICAgIHJldHVybiBcIjwhRE9DVFlQRSBodG1sPjxodG1sIGxhbmc9J3poJz5cIiArICQoXCJodG1sXCIpLmh0bWwoKSArIFwiPC9odG1sPlwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldERhdGUoKXtcbiAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICByZXR1cm4gZC5nZXRGdWxsWWVhcigpICsgJy0nICsgKGQuZ2V0TW9udGgoKSArIDEpICsgJy0nICsgZC5nZXREYXRlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlQ2hhbm5lbCgpe1xuICAgICAgICBzY29wZS5jaGFubmVsID0gY2hhbm5lbE1vZGVsU2VydmljZS5nZW5lcmF0ZUNoYW5uZWwoJ25ld3MnKTtcbiAgICAgICAgY2hhbm5lbFNlcnZpY2UuYWRkQ2hhbm5lbChwYXJhbXMuc2V0S2V5LCBwYXJhbXMuc2V0VmFsdWUsIHNjb3BlLmNoYW5uZWwsIGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICBzY29wZS5jaGFubmVsID0gcmVzLmRhdGE7XG4gICAgICAgICAgICBzY29wZS5jaGFubmVsSWQgPSBzY29wZS5jaGFubmVsLmNoYW5uZWxJZDtcbiAgICAgICAgICAgICRjb250YWluZXIuYXR0cignY2hhbm5lbGlkJywgc2NvcGUuY2hhbm5lbElkKTtcbiAgICAgICAgICAgIGNoYW5uZWxTZXJ2aWNlLnVwZGF0ZUNoYW5uZWxBdHRyKHNjb3BlLmNoYW5uZWwuY2hhbm5lbElkLCAncHVibGlzaERhdGUnLCBnZXREYXRlKCksIGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgdXBkYXRlQXR0ckxvY2FsbHkoc2NvcGUuY2hhbm5lbCwgJ3B1Ymxpc2hEYXRlJywgZ2V0RGF0ZSgpKTtcbiAgICAgICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZWRpdENoYW5uZWxBdHRyKCl7XG4gICAgICAgIHNjb3BlLmVkaXRBdHRyS2V5ID0gJCh0aGlzKS5hdHRyKCdibXktY2hhbm5lbC1hdHRyJyk7XG4gICAgICAgIHBvcFVwKHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IHRlbXBsYXRlUmVuZGVyKHt0ZXh0OiBnZXRBdHRyKHNjb3BlLmNoYW5uZWwsIHNjb3BlLmVkaXRBdHRyS2V5KX0sICd0ZXh0RWRpdE1vZGFsJyksIFxuICAgICAgICAgICAgYmluZDogW3tlbGVtZW50OlwiLnNhdmVcIiwgY2FsbGJhY2s6dXBkYXRlQXR0cn1dXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQXR0cihjb250YWluZXIsIGNhbGxiYWNrKXtcbiAgICAgICAgdmFyIHZhbHVlID0gY29udGFpbmVyLmZpbmQoXCIudGV4dC1pbnB1dFwiKS52YWwoKTtcbiAgICAgICAgY2hhbm5lbFNlcnZpY2UudXBkYXRlQ2hhbm5lbEF0dHIoc2NvcGUuY2hhbm5lbC5jaGFubmVsSWQsIHNjb3BlLmVkaXRBdHRyS2V5LCB2YWx1ZSwgZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIHVwZGF0ZUF0dHJMb2NhbGx5KHNjb3BlLmNoYW5uZWwsIHNjb3BlLmVkaXRBdHRyS2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICByZW5kZXJBdHRyRmllbGQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEF0dHIoZWxlbWVudCwga2V5KXtcbiAgICAgICAgaWYoIWVsZW1lbnQpXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcblx0XHR2YXIgYXR0ciA9IF8uZmluZChlbGVtZW50LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpe1xuXHQgICAgICAgIHJldHVybiBhdHRyLmtleSA9PSBrZXk7XG5cdCAgICB9KVxuXHQgICAgaWYoYXR0cil7XG5cdCAgICAgICAgcmV0dXJuIGF0dHIudmFsdWU7XG5cdCAgICB9ZWxzZXtcblx0ICAgICAgICByZXR1cm4gXCJcIjtcblx0ICAgIH1cblx0fVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQXR0ckxvY2FsbHkoZWxlbWVudCwga2V5LCB2YWx1ZSl7XG4gICAgICAgIHZhciB0ID0gXy5maW5kKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cil7XG4gICAgICAgICAgICByZXR1cm4gYXR0ci5rZXkgPT0ga2V5O1xuICAgICAgICB9KVxuICAgICAgICBpZih0KXtcbiAgICAgICAgICAgIHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBlbGVtZW50LmF0dHJpYnV0ZXMucHVzaCh7a2V5OmtleSwgdmFsdWU6dmFsdWV9KTtcbiAgICAgICAgfVxuICAgIH1cblxuXHRmdW5jdGlvbiBpbnRlcnBvbGF0ZShjc3Mpe1xuICAgICAgICB2YXIgcyA9IFwiI2FtLVwiICsgY2hhbm5lbElkICsgXCItY2hhbm5lbFwiO1xuICAgICAgICByZXR1cm4gJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4nICsgY3NzLnJlcGxhY2UoLyMjL2csIHMpICsgJzwvc3R5bGU+JztcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhbm5lbDsiLCJ2YXIgdGVtcGxhdGVSZW5kZXIgPSByZXF1aXJlKFwiLi9zZXJ2aWNlL3RlbXBsYXRlUmVuZGVyXCIpO1xudmFyIEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZV9lbGVtZW50Jyk7XG5cbmZ1bmN0aW9uICBEaXZpc2lvbiAoZGl2aXNpb24sIG1vZGUsICRjb250YWluZXIpIHtcblx0dmFyIHNjb3BlID0ge1xuXHRcdGRpdmlzaW9uIDogZGl2aXNpb24sXG4gICAgICAgIG1vZGUgOiBtb2RlXG5cdH1cblx0dmFyICRlbGUgPSAkY29udGFpbmVyO1xuXG4gICAgcHJlcGFyZUF0dHJzKCk7XG4gICAgcmVuZGVyKCk7XG5cbiAgICBmdW5jdGlvbiBwcmVwYXJlQXR0cnMoKXtcbiAgICAgICAgc2NvcGUuZGl2aXNpb25BdHRycyA9IHtcbiAgICAgICAgICAgIGNzc1ZhbHVlIDogZ2V0QXR0cihzY29wZS5kaXZpc2lvbiwgJ2Nzc1ZhbHVlJyksXG4gICAgICAgICAgICB0aXRsZSA6IGdldEF0dHIoc2NvcGUuZGl2aXNpb24sICd0aXRsZScpLFxuICAgICAgICAgICAgdGV4dEFsaWduIDogZ2V0QXR0cihzY29wZS5kaXZpc2lvbiwgJ3RleHRBbGlnbicpLFxuICAgICAgICAgICAgYmFja2dyb3VuZCA6IGdldEF0dHIoc2NvcGUuZGl2aXNpb24sICdiYWNrZ3JvdW5kJykgPyBnZXRBdHRyKHNjb3BlLmRpdmlzaW9uLCAnYmFja2dyb3VuZCcpIDogJycsXG4gICAgICAgICAgICBjYXJvdXNlbCA6IGdldEF0dHIoc2NvcGUuZGl2aXNpb24sICdjYXJvdXNlbCcpID09ICd5ZXMnLFxuICAgICAgICAgICAgY2Fyb3VzZWxOdW1iZXIgOiBnZXRBdHRyKHNjb3BlLmRpdmlzaW9uLCAnY2Fyb3VzZWxOdW1iZXInKSA/IGdldEF0dHIoc2NvcGUuZGl2aXNpb24sICdjYXJvdXNlbE51bWJlcicpIDogMSxcbiAgICAgICAgICAgIGxpbmtVcmwgOiBnZXRBdHRyKHNjb3BlLmRpdmlzaW9uLCAnbGlua1VybCcpXG4gICAgICAgIH1cblxuICAgICAgICBzY29wZS5kaXZpc2lvbkF0dHJzLndpZHRoID0gZ2V0QXR0cihzY29wZS5kaXZpc2lvbiwgJ3dpZHRoJykgPyBnZXRBdHRyKHNjb3BlLmRpdmlzaW9uLCAnd2lkdGgnKSA6ICcxMDAlJztcbiAgICAgICAgc2NvcGUuZGl2aXNpb25BdHRycy53aWR0aFRhYmxldCA9IGdldEF0dHIoc2NvcGUuZGl2aXNpb24sICd3aWR0aFRhYmxldCcpID8gZ2V0QXR0cihzY29wZS5kaXZpc2lvbiwgJ3dpZHRoVGFibGV0JykgOiBzY29wZS5kaXZpc2lvbkF0dHJzLndpZHRoO1xuICAgICAgICBzY29wZS5kaXZpc2lvbkF0dHJzLndpZHRoTW9iaWxlID0gZ2V0QXR0cihzY29wZS5kaXZpc2lvbiwgJ3dpZHRoTW9iaWxlJykgPyBnZXRBdHRyKHNjb3BlLmRpdmlzaW9uLCAnd2lkdGhNb2JpbGUnKSA6IHNjb3BlLmRpdmlzaW9uQXR0cnMud2lkdGhUYWJsZXQ7XG4gICAgICAgIHNjb3BlLmRpdmlzaW9uQXR0cnMuY2F0ZWdvcnkgPSBnZXRBdHRyKHNjb3BlLmRpdmlzaW9uLCAnY2F0ZWdvcnknKSA/IGdldEF0dHIoc2NvcGUuZGl2aXNpb24sICdjYXRlZ29yeScpIDogJyc7XG5cbiAgICAgICAgc2NvcGUuZGl2aXNpb25BdHRycy5jc3MgPSB0ZW1wbGF0ZVJlbmRlcihzY29wZSwgJ3N0eWxlX2RpdmlzaW9uJyk7XG4gICAgICAgIGlmKHNjb3BlLmRpdmlzaW9uQXR0cnMuY3NzVmFsdWUpe1xuICAgICAgICAgICAgc2NvcGUuZGl2aXNpb25BdHRycy5jc3MgPSAgc2NvcGUuZGl2aXNpb25BdHRycy5jc3MgKyBpbnRlcnBvbGF0ZShzY29wZS5kaXZpc2lvbkF0dHJzLmNzc1ZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlcigpe1xuICAgIFx0JGVsZSA9ICQodGVtcGxhdGVSZW5kZXIoc2NvcGUsICdkaXZpc2lvbicpKS5hcHBlbmRUbygkY29udGFpbmVyKTtcblxuICAgICAgICAkZWxlLmZpbmQoXCIuZGl2aXNpb24tc3R5bGUtY29udGFpbmVyXCIpLmh0bWwoc2NvcGUuZGl2aXNpb25BdHRycy5jc3MpO1xuXG4gICAgICAgIF8uZWFjaChzY29wZS5kaXZpc2lvbi5lbGVtZW50cywgZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpe1xuICAgICAgICAgICAgZWxlbWVudC5pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgRWxlbWVudChlbGVtZW50LCBzY29wZS5tb2RlLCAkZWxlLmZpbmQoXCIuZWxlbWVudHMtY29udGFpbmVyXCIpKTtcbiAgICAgICAgfSlcblxuICAgICAgICBpZihzY29wZS5kaXZpc2lvbkF0dHJzLmxpbmtVcmwpe1xuICAgICAgICAgICAgYmluZExpbmsoc2NvcGUuZGl2aXNpb25BdHRycy5saW5rVXJsKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGRpdmlzaW9uLmxpbmtJZCAmJiBkaXZpc2lvbi5saW5rKXtcbiAgICAgICAgICAgIGJpbmRMaW5rKGRpdmlzaW9uLmxpbmsgKyBcIi9cIiArIGRpdmlzaW9uLmxpbmtJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBiaW5kTGluayh1cmwpe1xuICAgICAgICAgICAgJGVsZS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgJGVsZS5hdHRyKCdibXktbGluaycsIHVybCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBdHRyKGVsZW1lbnQsIGtleSl7XG5cdFx0dmFyIGF0dHIgPSBfLmZpbmQoZWxlbWVudC5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKXtcblx0ICAgICAgICByZXR1cm4gYXR0ci5rZXkgPT0ga2V5O1xuXHQgICAgfSlcblx0ICAgIGlmKGF0dHIpe1xuXHQgICAgICAgIHJldHVybiBhdHRyLnZhbHVlO1xuXHQgICAgfWVsc2V7XG5cdCAgICAgICAgcmV0dXJuIFwiXCI7XG5cdCAgICB9XG5cdH1cblxuXHRmdW5jdGlvbiBpbnRlcnBvbGF0ZShjc3Mpe1xuICAgICAgICB2YXIgcyA9IFwiI2FtLVwiICsgc2NvcGUuZGl2aXNpb24uZGl2aXNpb25JZCArIFwiLWRpdmlzaW9uXCI7XG4gICAgICAgIHJldHVybiAnPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPicgKyBjc3MucmVwbGFjZSgvIyMvZywgcykgKyAnPC9zdHlsZT4nO1xuICAgIH1cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRGl2aXNpb247IiwidmFyIHRlbXBsYXRlUmVuZGVyID0gcmVxdWlyZShcIi4vc2VydmljZS90ZW1wbGF0ZVJlbmRlclwiKTtcbnZhciBjaGFubmVsTW9kZWxTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZXJ2aWNlL2NoYW5uZWxNb2RlbFNlcnZpY2UnKTtcbnZhciBjaGFubmVsU2VydmljZSA9IHJlcXVpcmUoJy4vc2VydmljZS9jaGFubmVsU2VydmljZScpO1xudmFyIHBvcFVwID0gcmVxdWlyZSgnLi9lZmZlY3QvcG9wVXAnKTtcbnZhciBJbWFnZUVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZV9pbWFnZUVsZW1lbnQnKTtcbnZhciBUZXh0RWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlX3RleHRFbGVtZW50Jyk7XG52YXIgSHRtbEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZV9odG1sRWxlbWVudCcpO1xuXG5mdW5jdGlvbiAgRWxlbWVudCAoZWxlbWVudCwgbW9kZSwgICRjb250YWluZXIpIHtcblx0dmFyIHNjb3BlID0ge1xuXHRcdGVsZW1lbnQgOiBlbGVtZW50LFxuICAgICAgICBtb2RlIDogbW9kZVxuXHR9XG5cdHZhciAkZWxlO1xuXG5cdHJlbmRlcigpO1xuXG4gICAgaWYoc2NvcGUubW9kZSA9PSAnZWRpdCcpe1xuICAgICAgICAkZWxlLmNsaWNrKGVkaXQpO1xuICAgIH1cblxuXHRmdW5jdGlvbiByZW5kZXIoKXtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgICBzY29wZS5hdHRycyA9IHtcbiAgICAgICAgICAgIHZhbHVlIDogc2NvcGUuZWxlbWVudC52YWx1ZSxcbiAgICAgICAgICAgIGNzc1ZhbHVlIDogZ2V0QXR0cihzY29wZS5lbGVtZW50LCAnY3NzVmFsdWUnKSxcbiAgICAgICAgICAgIGxpbmtVcmwgOiBnZXRBdHRyKHNjb3BlLmVsZW1lbnQsICdsaW5rVXJsJyksXG4gICAgICAgICAgICB0eXBlIDogZ2V0QXR0cihzY29wZS5lbGVtZW50LCAndHlwZScpLFxuICAgICAgICAgICAgY2F0ZWdvcnkgOiBnZXRBdHRyKHNjb3BlLmVsZW1lbnQsICdjYXRlZ29yeScpLFxuICAgICAgICAgICAgdGl0bGUgOiBnZXRBdHRyKHNjb3BlLmVsZW1lbnQsICd0aXRsZScpLFxuICAgICAgICAgICAgbWVkaWFUeXBlIDogZ2V0QXR0cihzY29wZS5lbGVtZW50LCAnbWVkaWFUeXBlJylcbiAgICAgICAgfTtcblxuICAgICAgICBzY29wZS5hdHRycy50ZXh0QWxpZ24gPSBnZXRBdHRyKHNjb3BlLmVsZW1lbnQsICd0ZXh0QWxpZ24nKTtcbiAgICAgICAgc2NvcGUuYXR0cnMuY29sb3IgPSBnZXRBdHRyKHNjb3BlLmVsZW1lbnQsICdjb2xvcicpID8gZ2V0QXR0cihzY29wZS5lbGVtZW50LCAnY29sb3InKSA6ICcnO1xuICAgICAgICBzY29wZS5hdHRycy5mb250U2l6ZSA9IGdldEF0dHIoc2NvcGUuZWxlbWVudCwgJ2ZvbnRTaXplJyk7XG4gICAgICAgIHNjb3BlLmF0dHJzLndpZHRoID0gZ2V0QXR0cihzY29wZS5lbGVtZW50LCAnd2lkdGgnKSA/IGdldEF0dHIoc2NvcGUuZWxlbWVudCwgJ3dpZHRoJykgOiAnMTAwJSc7XG4gICAgICAgIHNjb3BlLmF0dHJzLndpZHRoVGFibGV0ID0gZ2V0QXR0cihzY29wZS5lbGVtZW50LCAnd2lkdGhUYWJsZXQnKSA/IGdldEF0dHIoc2NvcGUuZWxlbWVudCwgJ3dpZHRoVGFibGV0JykgOiBzY29wZS5hdHRycy53aWR0aDtcbiAgICAgICAgc2NvcGUuYXR0cnMud2lkdGhNb2JpbGUgPSBnZXRBdHRyKHNjb3BlLmVsZW1lbnQsICd3aWR0aE1vYmlsZScpID8gZ2V0QXR0cihzY29wZS5lbGVtZW50LCAnd2lkdGhNb2JpbGUnKSA6IHNjb3BlLmF0dHJzLndpZHRoVGFibGV0O1xuICAgICAgICBzY29wZS5hdHRycy5oZWlnaHQgPSBnZXRBdHRyKHNjb3BlLmVsZW1lbnQsICdoZWlnaHQnKSA/IGdldEF0dHIoc2NvcGUuZWxlbWVudCwgJ2hlaWdodCcpIDogJ2F1dG8nO1xuICAgICAgICBzY29wZS5hdHRycy5jYXRlZ29yeSA9IGdldEF0dHIoc2NvcGUuZWxlbWVudCwgJ2NhdGVnb3J5JykgPyBnZXRBdHRyKHNjb3BlLmVsZW1lbnQsICdjYXRlZ29yeScpIDogJyc7XG5cbiAgICAgICAgc2NvcGUuYXR0cnMuY3NzID0gdGVtcGxhdGVSZW5kZXIoc2NvcGUsICdzdHlsZV9lbGVtZW50Jyk7XG4gICAgICAgIGlmKHNjb3BlLmF0dHJzLmNzc1ZhbHVlKXtcbiAgICAgICAgICAgIHNjb3BlLmF0dHJzLmNzcyA9ICBzY29wZS5hdHRycy5jc3MgKyBpbnRlcnBvbGF0ZShzY29wZS5hdHRycy5jc3NWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdHlwZSA9IGdldEF0dHIoc2NvcGUuZWxlbWVudCwgJ3R5cGUnKTtcbiAgICAgICAgaWYoY2hhbm5lbE1vZGVsU2VydmljZS5pc0ltYWdlRWxlbWVudCh0eXBlKSl7XG4gICAgICAgICAgICBzY29wZS5lbGVtZW50VHlwZSA9ICdpbWFnZSc7XG4gICAgICAgICAgICBzY29wZS5hdHRycy5hc0JhY2tncm91bmQgPSBnZXRBdHRyKHNjb3BlLmVsZW1lbnQsICdhc0JhY2tncm91bmQnKSA9PSAneWVzJztcbiAgICAgICAgICAgIGNvbnRlbnQgID0gSW1hZ2VFbGVtZW50KHNjb3BlLmVsZW1lbnQpO1xuICAgICAgICB9ZWxzZSBpZihjaGFubmVsTW9kZWxTZXJ2aWNlLmlzVGV4dEVsZW1lbnQodHlwZSkpe1xuICAgICAgICAgICAgc2NvcGUuZWxlbWVudFR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICBjb250ZW50ICA9IFRleHRFbGVtZW50KHNjb3BlLmVsZW1lbnQpO1xuICAgICAgICB9ZWxzZSBpZihjaGFubmVsTW9kZWxTZXJ2aWNlLmlzSHRtbEVsZW1lbnQodHlwZSkpe1xuICAgICAgICAgICAgc2NvcGUuZWxlbWVudFR5cGUgPSAnaHRtbCc7XG4gICAgICAgICAgICBjb250ZW50ICA9IEh0bWxFbGVtZW50KHNjb3BlLmVsZW1lbnQpO1xuICAgICAgICB9ZWxzZSBpZih0eXBlID09ICdyaWNodGV4dCcpe1xuICAgICAgICAgICAgc2NvcGUuZWxlbWVudFR5cGUgPSAncmljaHRleHQnO1xuICAgICAgICAgICAgY29udGVudCAgPSBIdG1sRWxlbWVudChzY29wZS5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYoJGVsZSl7XG4gICAgICAgICAgICAkZWxlLmZpbmQoXCIuYW1lcmljYW5vLWVsZW1lbnQgLmVsZW1lbnQtY29udGVudFwiKS5odG1sKFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICRlbGUgPSAkKHRlbXBsYXRlUmVuZGVyKHNjb3BlLCAnZWxlbWVudCcpKS5hcHBlbmRUbygkY29udGFpbmVyKTsgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRlbGUuZmluZChcIi5lbGVtZW50LWNvbnRlbnRcIikuaHRtbChjb250ZW50KTtcbiAgICAgICAgJGVsZS5maW5kKFwiLmVsZW1lbnQtc3R5bGUtY29udGFpbmVyXCIpLmh0bWwoc2NvcGUuYXR0cnMuY3NzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlZGl0KCl7XG4gICAgICAgIHZhciBpbml0cyA9IFtdO1xuXG4gICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICBjb250ZW50OiB0ZW1wbGF0ZVJlbmRlcih7dmFsdWU6IHNjb3BlLmF0dHJzLnZhbHVlfSwgc2NvcGUuZWxlbWVudFR5cGUgKyAnRWxlbWVudEVkaXQnKSwgXG4gICAgICAgICAgICBiaW5kOiBbe2VsZW1lbnQ6XCIuc2F2ZVwiLCBjYWxsYmFjazpzYXZlVmFsdWV9XVxuICAgICAgICB9XG4gICAgICAgIGlmKHNjb3BlLmVsZW1lbnRUeXBlID09ICdyaWNodGV4dCcpe1xuICAgICAgICAgICAgcGFyYW1zLmluaXRVZWRpdG9yID0gXCJ1ZS1jb250YWluZXJcIjtcbiAgICAgICAgfVxuICAgICAgICBpZihzY29wZS5lbGVtZW50VHlwZSA9PSAnaW1hZ2UnKXtcbiAgICAgICAgICAgIHBhcmFtcy5pbml0SW1hZ2VVcGxvYWQgPSB7XG4gICAgICAgICAgICAgICAgYnRuIDogXCJpbWFnZS11cGxvYWQtYnRuXCIsXG4gICAgICAgICAgICAgICAgY29udGFpbmVyIDogXCJpbWFnZS1zYW1wbGUtY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3MgOiBwcm9ncmVzc1VwZGF0ZSxcbiAgICAgICAgICAgICAgICBmaW5pc2ggOiB1cGRhdGVWYWx1ZVxuICAgICAgICAgICAgfTsgXG4gICAgICAgIH1cbiAgICAgICAgaWYoc2NvcGUuZWxlbWVudFR5cGUgPT0gJ3RleHQnKXtcbiAgICAgICAgICAgIHZhciBlID0gJCgnPGRpdj4nICsgcGFyYW1zLmNvbnRlbnQgKyAnPC9kaXY+Jyk7XG4gICAgICAgICAgICBlLmZpbmQoXCIuZWxlbWVudC12YWx1ZVwiKS5odG1sKHNjb3BlLmF0dHJzLnZhbHVlKTtcbiAgICAgICAgICAgIHBhcmFtcy5jb250ZW50ID0gJChlKS5odG1sKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwb3BVcChwYXJhbXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZVZhbHVlKGNvbnRhaW5lciwgY2FsbGJhY2spe1xuICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgIGlmKHNjb3BlLmVsZW1lbnRUeXBlID09ICd0ZXh0Jyl7XG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnRhaW5lci5maW5kKFwiLmVsZW1lbnQtdmFsdWVcIikudmFsKCk7XG4gICAgICAgIH1lbHNlIGlmKHNjb3BlLmVsZW1lbnRUeXBlID09ICdyaWNodGV4dCcpe1xuICAgICAgICAgICAgdmFsdWUgPSBjb250YWluZXIuZmluZChcIiN1ZS1jb250YWluZXIgLmVkdWktZWRpdG9yLWlmcmFtZWhvbGRlciBpZnJhbWVcIikuY29udGVudHMoKS5maW5kKFwiYm9keVwiKS5odG1sKCk7XG4gICAgICAgIH1cbiAgICAgICAgdXBkYXRlVmFsdWUodmFsdWUsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVWYWx1ZSh2YWx1ZSwgY2FsbGJhY2spe1xuICAgICAgICBzY29wZS5lbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGNoYW5uZWxTZXJ2aWNlLnVwZGF0ZUVsZW1lbnQoc2NvcGUuZWxlbWVudCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvZ3Jlc3NVcGRhdGUocGVyY2VudCl7XG4gICAgICAgICQoXCIubW9kYWwtZGlhbG9nIC51cGxvYWRpbmctbXNnXCIpLnRleHQoXCLkuIrkvKDkuK0uLlwiICsgcGVyY2VudCArIFwiJVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBdHRyKGVsZW1lbnQsIGtleSl7XG5cdFx0dmFyIGF0dHIgPSBfLmZpbmQoZWxlbWVudC5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKXtcblx0ICAgICAgICByZXR1cm4gYXR0ci5rZXkgPT0ga2V5O1xuXHQgICAgfSlcblx0ICAgIGlmKGF0dHIpe1xuXHQgICAgICAgIHJldHVybiBhdHRyLnZhbHVlO1xuXHQgICAgfWVsc2V7XG5cdCAgICAgICAgcmV0dXJuIFwiXCI7XG5cdCAgICB9XG5cdH1cblxuXHRmdW5jdGlvbiBpbnRlcnBvbGF0ZShjc3Mpe1xuICAgICAgICB2YXIgcyA9IFwiI2FtLVwiICsgc2NvcGUuZWxlbWVudC5lbGVtZW50SWQgKyBcIi1lbGVtZW50XCI7XG4gICAgICAgIHJldHVybiAnPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPicgKyBjc3MucmVwbGFjZSgvIyMvZywgcykgKyAnPC9zdHlsZT4nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlTW9kYWwoKXtcbiAgICAgICAgJChcIi5tb2RhbFwiKS5yZW1vdmUoKTtcbiAgICAgICAgJChcIi5tb2RhbC1iYWNrZHJvcFwiKS5yZW1vdmUoKTtcbiAgICAgICAgJChcIiNlZHVpX2ZpeGVkbGF5ZXJcIikucmVtb3ZlKCk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVsZW1lbnQ7IiwidmFyIHRlbXBsYXRlUmVuZGVyID0gcmVxdWlyZShcIi4vc2VydmljZS90ZW1wbGF0ZVJlbmRlclwiKTtcblxuZnVuY3Rpb24gaHRtbEVsZW1lbnQoZWxlbWVudCkge1xuXHR2YXIgbm9uTGlua0RvbTEgPSBbJzxkaXYgc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9jazsgd2lkdGg6MTAwJTtcIj48ZGl2PicsICc8L2Rpdj48L2Rpdj4nXTtcblx0dmFyIGxpbmtEb24xID0gWyc8YSBocmVmPVwiJyArIGdldEF0dHIoZWxlbWVudCwgJ2xpbmtVcmwnKSArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj48ZGl2PicsICc8L2Rpdj48L2E+J107XG5cdHZhciBkb20xID0gZ2V0QXR0cihlbGVtZW50LCAnbGlua1VybCcpID8gbGlua0RvbjEgOiBub25MaW5rRG9tMTtcblx0dmFyIGh0bWwgPSBkb20xWzBdICsgZWxlbWVudC52YWx1ZSArIGRvbTFbMV07XG5cdHJldHVybiB0ZW1wbGF0ZVJlbmRlcih7aHRtbDogaHRtbH0sICdodG1sRWxlbWVudCcpO1xuXG4gICAgZnVuY3Rpb24gZ2V0QXR0cihlbGVtZW50LCBrZXkpe1xuXHRcdHZhciBhdHRyID0gXy5maW5kKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cil7XG5cdCAgICAgICAgcmV0dXJuIGF0dHIua2V5ID09IGtleTtcblx0ICAgIH0pXG5cdCAgICBpZihhdHRyKXtcblx0ICAgICAgICByZXR1cm4gYXR0ci52YWx1ZTtcblx0ICAgIH1lbHNle1xuXHQgICAgICAgIHJldHVybiBcIlwiO1xuXHQgICAgfVxuXHR9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGh0bWxFbGVtZW50OyIsInZhciB0ZW1wbGF0ZVJlbmRlciA9IHJlcXVpcmUoXCIuL3NlcnZpY2UvdGVtcGxhdGVSZW5kZXJcIik7XG5cbmZ1bmN0aW9uIGltYWdlRWxlbWVudChlbGVtZW50KSB7XG5cdHZhciBjb250ZW50ID0gXCJcIjtcblxuXHRmdW5jdGlvbiBnZXRTcmMoKXtcblx0XHRpZighZ2V0QXR0cihlbGVtZW50LCAndGh1bWJuYWlsV2lkdGgnKSl7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdmFyIGltZyA9IGVsZW1lbnQudmFsdWU7XG4gICAgICAgIGlmIChpbWcuaW5kZXhPZihcImltYWdlTW9ncjIvdGh1bWJuYWlsXCIpIDwgMCAmJiBpbWcuaW5kZXhPZihcInFpbml1XCIpID4gMCkge1xuICAgICAgICAgIGltZyA9IGltZyArIFwiP2ltYWdlTW9ncjIvdGh1bWJuYWlsL1wiICsgZ2V0QXR0cihlbGVtZW50LCAndGh1bWJuYWlsV2lkdGgnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW1nO1xuXHR9XG5cblx0dmFyIG5vbkxpbmtEb20xID0gWyc8ZGl2IHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2s7IHdpZHRoOjEwMCU7XCI+JywgJzwvZGl2PiddO1xuXHR2YXIgbGlua0RvbjEgPSBbJzxhIGhyZWY9XCInICsgZ2V0QXR0cihlbGVtZW50LCAnbGlua1VybCcpICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiPicsICc8L2E+J107XG5cblx0dmFyIG5vbkJhY2tncm91bmREb20yID0gJzxpbWcgc3JjPVwiJyArIGdldFNyYygpICsgJ1wiIGNsYXNzPVwiaW1hZ2UtaXRlbVwiPic7XG5cdHZhciBiYWNrZ3JvdW5kRG9tMiA9ICc8ZGl2IHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCcgKyBnZXRTcmMoKSArICcpO2JhY2tncm91bmQtcG9zaXRpb246IDUwJSA1MCU7YmFja2dyb3VuZC1zaXplOiBhdXRvIDEwMCU7IGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XCIgY2xhc3M9XCJpbWFnZS1mcmFtZVwiPjwvZGl2Pic7XG5cdHZhciBkb20xID0gZ2V0QXR0cihlbGVtZW50LCAnbGlua1VybCcpID8gbGlua0RvbjEgOiBub25MaW5rRG9tMTtcblx0dmFyIGRvbTIgPSBnZXRBdHRyKGVsZW1lbnQsICdhc0JhY2tncm91bmQnKSA9PSAneWVzJyA/IGJhY2tncm91bmREb20yIDogbm9uQmFja2dyb3VuZERvbTI7XG5cblx0cmV0dXJuIHRlbXBsYXRlUmVuZGVyKHtodG1sOiBkb20xWzBdICsgXCI8ZGl2PlwiICsgZG9tMiArIFwiPC9kaXY+XCIgKyBkb20xWzFdfSwgJ2ltYWdlRWxlbWVudCcpO1xuXG4gICAgZnVuY3Rpb24gZ2V0QXR0cihlbGVtZW50LCBrZXkpe1xuXHRcdHZhciBhdHRyID0gXy5maW5kKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cil7XG5cdCAgICAgICAgcmV0dXJuIGF0dHIua2V5ID09IGtleTtcblx0ICAgIH0pXG5cdCAgICBpZihhdHRyKXtcblx0ICAgICAgICByZXR1cm4gYXR0ci52YWx1ZTtcblx0ICAgIH1lbHNle1xuXHQgICAgICAgIHJldHVybiBcIlwiO1xuXHQgICAgfVxuXHR9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGltYWdlRWxlbWVudDsiLCJ2YXIgY2hhbm5lbFN5bmNTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZXJ2aWNlL2NoYW5uZWxTeW5jU2VydmljZScpO1xudmFyIGNoYW5uZWxTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZXJ2aWNlL2NoYW5uZWxTZXJ2aWNlJyk7XG52YXIgdGVtcGxhdGVSZW5kZXIgPSByZXF1aXJlKFwiLi9zZXJ2aWNlL3RlbXBsYXRlUmVuZGVyXCIpO1xudmFyIERpdmlzaW9uID0gcmVxdWlyZSgnLi9lbGVfZGl2aXNpb24nKTtcbnZhciBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVfZWxlbWVudCcpO1xudmFyIENhcm91c2VsID0gcmVxdWlyZSgnLi9lZmZlY3QvY2Fyb3VzZWwnKTtcblxuZnVuY3Rpb24gIFNlY3Rpb24gKHBhcmFtcywgY29udGFpbmVyKSB7XG5cdHZhciBzY29wZSA9IHtcbiAgICAgICAgc2VjdGlvbiA6IHBhcmFtcy5zZWN0aW9uID8gcGFyYW1zLnNlY3Rpb24gOiBudWxsLFxuICAgICAgICBzZWN0aW9uSWQgOiBwYXJhbXMuc2VjdGlvbklkLFxuXHRcdGF0dHJzIDoge30sXG5cdFx0dGl0bGVFbGVtZW50IDogbnVsbCxcbiAgICAgICAgbW9kZSA6IHdpbmRvdy5DVk0ubW9kZVxuXHR9O1xuICAgIFxuICAgIGlmKHBhcmFtcy5zdGF0aWNSZW5kZXIgJiYgc2NvcGUubW9kZSAhPSAnZWRpdCcpXG4gICAgICAgIHJldHVybjtcblxuXHR2YXIgJGVsZSA9ICRjb250YWluZXIgPSAkKGNvbnRhaW5lcik7XG5cbiAgICBpZighc2NvcGUuc2VjdGlvbil7XG4gICAgICAgIGZldGNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb250ZW50U3luYyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHByZXBhcmVBdHRycygpO1xuICAgICAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgICAgIGVmZmVjdCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICAgIGNvbnRlbnRTeW5jKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBwcmVwYXJlQXR0cnMoKTtcbiAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgZWZmZWN0KCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmV0Y2goY2FsbGJhY2spe1xuICAgICAgICBjaGFubmVsU2VydmljZS5nZXRTZWN0aW9uKHNjb3BlLnNlY3Rpb25JZCwgZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIHNjb3BlLnNlY3Rpb24gPSByZXMuZGF0YTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNvbnRlbnRTeW5jKGNhbGxiYWNrKXtcbiAgICBcdGlmKGdldEF0dHIoc2NvcGUuc2VjdGlvbiwgJ2NvbnRlbnRTeW5jJykgPT0gJ3llcycpe1xuICAgICAgICAgICAgY2hhbm5lbFN5bmNTZXJ2aWNlLnN5bmNTZWN0aW9uKHNjb3BlLnNlY3Rpb24sIHBhcmFtcy5saW1pdCwgZnVuY3Rpb24oc2VjdGlvbil7XG4gICAgICAgICAgICAgICAgc2NvcGUuc2VjdGlvbiA9IHNlY3Rpb247XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVwYXJlQXR0cnMoKXtcbiAgICAgICAgdmFyIHNlY3Rpb24gPSBzY29wZS5zZWN0aW9uO1xuICAgIFx0c2NvcGUuYXR0cnMgPSB7XG4gICAgICAgICAgICBzdGF0dXMgOiBnZXRBdHRyKHNlY3Rpb24sICdzdGF0dXMnKSxcbiAgICAgICAgICAgIGNzc1ZhbHVlIDogZ2V0QXR0cihzZWN0aW9uLCAnY3NzVmFsdWUnKSxcbiAgICAgICAgICAgIHRpdGxlIDogZ2V0QXR0cihzZWN0aW9uLCAndGl0bGUnKSxcbiAgICAgICAgICAgIGRpc3BsYXlUaXRsZSA6ICBnZXRBdHRyKHNlY3Rpb24sICdkaXNwbGF5VGl0bGUnKSAhPSAnbm8nLFxuICAgICAgICAgICAgd2lkdGggOiBnZXRBdHRyKHNlY3Rpb24sICd3aWR0aCcpID09ICdmdWxsJyA/ICcxMDAlJyA6ICcxMDAwcHgnLFxuICAgICAgICAgICAgdGV4dEFsaWduIDogZ2V0QXR0cihzZWN0aW9uLCAndGV4dEFsaWduJykgPyBnZXRBdHRyKHNlY3Rpb24sICd0ZXh0QWxpZ24nKSA6ICdjZW50ZXInLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yIDogZ2V0QXR0cihzZWN0aW9uLCAnYmFja2dyb3VuZENvbG9yJyksXG4gICAgICAgICAgICBiYWNrZ3JvdW5kSW1nIDogZ2V0QXR0cihzZWN0aW9uLCAnYmFja2dyb3VuZEltZycpID8gZ2V0QXR0cihzZWN0aW9uLCAnYmFja2dyb3VuZEltZycpIDogJycsXG4gICAgICAgICAgICBjYXJvdXNlbCA6IGdldEF0dHIoc2VjdGlvbiwgJ2Nhcm91c2VsJykgPT0gJ3llcycsXG4gICAgICAgICAgICBjYXJvdXNlbE51bWJlciA6IGdldEF0dHIoc2VjdGlvbiwgJ2Nhcm91c2VsTnVtYmVyJykgPyBnZXRBdHRyKHNlY3Rpb24sICdjYXJvdXNlbE51bWJlcicpIDogMSxcbiAgICAgICAgICAgIGNhcm91c2VsQXV0b1BsYXkgOiBnZXRBdHRyKHNlY3Rpb24sICdjYXJvdXNlbEF1dG9QbGF5JykgPT0gJ3llcycsXG4gICAgICAgICAgICBwYXJ0aWNpcGFudExpbWl0ZWQgOiBnZXRBdHRyKHNlY3Rpb24sICdwYXJ0aWNpcGFudExpbWl0ZWQnKSA9PSAneWVzJyxcbiAgICAgICAgICAgIGNvbnRlbnRTeW5jVG9nZ2xlIDogZ2V0QXR0cihzZWN0aW9uLCAnY29udGVudFN5bmMnKSAhPSAnJyB8fCBnZXRBdHRyKHNlY3Rpb24sICdldmVudFN5bmNLZXknKSxcbiAgICAgICAgICAgIGNvbnRlbnRTeW5jIDogZ2V0QXR0cihzZWN0aW9uLCAnY29udGVudFN5bmMnKSA9PSAneWVzJyxcbiAgICAgICAgICAgIHN5bmNUeXBlIDogZ2V0QXR0cihzZWN0aW9uLCAnc3luY1R5cGUnKSxcbiAgICAgICAgICAgIHN5bmNTZXRLZXkgOiBnZXRBdHRyKHNlY3Rpb24sICdzeW5jU2V0S2V5JyksXG4gICAgICAgICAgICBzeW5jU2V0VmFsdWUgOiBnZXRBdHRyKHNlY3Rpb24sICdzeW5jU2V0VmFsdWUnKVxuICAgICAgICB9O1xuICAgICAgXHRzY29wZS5hdHRycy5jc3MgPSB0ZW1wbGF0ZVJlbmRlcihzY29wZSwgJ3N0eWxlX3NlY3Rpb24nKTtcbiAgICAgICAgXG4gICAgICAgIGlmKGdldEF0dHIoc2VjdGlvbiwgJ2Nzc0tleScpKXtcbiAgICAgICAgICAgIHNjb3BlLmF0dHJzLmNzcyArPSB0ZW1wbGF0ZVJlbmRlcihzY29wZSwgJ3N0eWxlXycgKyBnZXRBdHRyKHNlY3Rpb24sICdjc3NLZXknKSArICdfc2VjdGlvbicpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHNjb3BlLmF0dHJzLmNzc1ZhbHVlKXtcbiAgICAgICAgICAgIHNjb3BlLmF0dHJzLmNzcyA9ICBzY29wZS5hdHRycy5jc3MgKyBpbnRlcnBvbGF0ZShzY29wZS5hdHRycy5jc3NWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoc2NvcGUuYXR0cnMuY2Fyb3VzZWwpe1xuICAgICAgICAgICAgc2NvcGUuYXR0cnMuY3NzID0gIHNjb3BlLmF0dHJzLmNzcyArIHRlbXBsYXRlUmVuZGVyKHNjb3BlLCAnc3R5bGVTbGljaycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyKCl7XG4gICAgICAgICRjb250YWluZXIuZmluZChcIi5hbWVyaWNhbm8tc2VjdGlvblwiKS5yZW1vdmUoKTtcbiAgICAgXHQkZWxlID0gJCh0ZW1wbGF0ZVJlbmRlcihzY29wZSwgJ3NlY3Rpb24nKSkuYXBwZW5kVG8oJGNvbnRhaW5lcik7XG5cbiAgICAgICAgJGVsZS5maW5kKFwiLnNlY3Rpb24tc3R5bGUtY29udGFpbmVyXCIpLmh0bWwoc2NvcGUuYXR0cnMuY3NzKTtcblxuICAgICAgICBpZihnZXRBdHRyKHNjb3BlLnNlY3Rpb24sICdkaXNwbGF5VGl0bGUnKSAhPSAnbm8nICYmIGdldEF0dHIoc2NvcGUuc2VjdGlvbiwgJ3RpdGxlJykpe1xuICAgICAgICAgICAgdmFyIHRpdGxlID0gIHRleHRFbGVtZW50KHt2YWx1ZTogZ2V0QXR0cihzY29wZS5zZWN0aW9uLCAndGl0bGUnKX0pO1xuICAgICAgICAgICAgRWxlbWVudCh0aXRsZSwgJGVsZS5maW5kKFwiLnNlY3Rpb24tdGl0bGUtZWxlbWVudFwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2goc2NvcGUuc2VjdGlvbi5kaXZpc2lvbnMsIGZ1bmN0aW9uKGRpdmlzaW9uLCBpbmRleCl7XG4gICAgICAgICAgICBkaXZpc2lvbi5pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgaWYocGFyYW1zLmRpdmlzaW9uTGluayl7XG4gICAgICAgICAgICAgICAgZGl2aXNpb24ubGluayA9IHBhcmFtcy5kaXZpc2lvbkxpbms7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIERpdmlzaW9uKGRpdmlzaW9uLCBzY29wZS5tb2RlLCAkZWxlLmZpbmQoXCIuZGl2aXNpb25zLWNvbnRhaW5lclwiKSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZWZmZWN0KCl7XG4gICAgICAgIGlmKHNjb3BlLmF0dHJzLmNhcm91c2VsKXtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgYXV0b3BsYXkgOiBzY29wZS5hdHRycy5jYXJvdXNlbEF1dG9QbGF5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBDYXJvdXNlbChwYXJhbXMgLCRlbGUuZmluZChcIi5kaXZpc2lvbnMtY29udGFpbmVyXCIpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEF0dHIoZWxlbWVudCwga2V5KXtcblx0XHR2YXIgYXR0ciA9IF8uZmluZChlbGVtZW50LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpe1xuXHQgICAgICAgIHJldHVybiBhdHRyLmtleSA9PSBrZXk7XG5cdCAgICB9KVxuXHQgICAgaWYoYXR0cil7XG5cdCAgICAgICAgcmV0dXJuIGF0dHIudmFsdWU7XG5cdCAgICB9ZWxzZXtcblx0ICAgICAgICByZXR1cm4gXCJcIjtcblx0ICAgIH1cblx0fVxuXG5cdGZ1bmN0aW9uIGludGVycG9sYXRlKGNzcyl7XG4gICAgICAgIHZhciBzID0gXCIjYW0tXCIgKyBzY29wZS5zZWN0aW9uLnNlY3Rpb25JZCArIFwiLXNlY3Rpb25cIjtcbiAgICAgICAgcmV0dXJuICc8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+JyArIGNzcy5yZXBsYWNlKC8jIy9nLCBzKSArICc8L3N0eWxlPic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGV4dEVsZW1lbnQocGFyYW1zKXtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHBhcmFtcyA/IHBhcmFtcyA6IHt9O1xuICAgICAgICBwYXJhbXMuYXR0cmlidXRlcyA9IHBhcmFtcy5hdHRyaWJ1dGVzID8gcGFyYW1zLmF0dHJpYnV0ZXMgOiBbXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleSA6IFwiXCIsXG4gICAgICAgICAgICB2YWx1ZSA6IHBhcmFtcy52YWx1ZSA/IHBhcmFtcy52YWx1ZSA6IFwidGV4dFwiLFxuICAgICAgICAgICAgYXR0cmlidXRlcyA6IF8udW5pb24oW3tcbiAgICAgICAgICAgICAgICBrZXkgOiBcInR5cGVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZSA6IHBhcmFtcy50eXBlID8gcGFyYW1zLnR5cGUgOiAndGV4dCdcbiAgICAgICAgICAgIH1dLCBwYXJhbXMuYXR0cmlidXRlcylcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWN0aW9uOyIsInZhciBjaGFubmVsU3luY1NlcnZpY2UgPSByZXF1aXJlKCcuL3NlcnZpY2UvY2hhbm5lbFN5bmNTZXJ2aWNlJyk7XG52YXIgY2hhbm5lbFNlcnZpY2UgPSByZXF1aXJlKCcuL3NlcnZpY2UvY2hhbm5lbFNlcnZpY2UnKTtcbnZhciB0ZW1wbGF0ZVJlbmRlciA9IHJlcXVpcmUoXCIuL3NlcnZpY2UvdGVtcGxhdGVSZW5kZXJcIik7XG52YXIgRGl2aXNpb24gPSByZXF1aXJlKCcuL2VsZV9kaXZpc2lvbicpO1xudmFyIEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZV9lbGVtZW50Jyk7XG52YXIgQ2Fyb3VzZWwgPSByZXF1aXJlKCcuL2VmZmVjdC9jYXJvdXNlbCcpO1xuXG5mdW5jdGlvbiAgU2V0U2VjdGlvbiAocGFyYW1zLCBjb250YWluZXIpIHtcblx0dmFyIHNjb3BlID0ge1xuICAgICAgICBzZWN0aW9uIDogbnVsbCxcblx0XHRhdHRycyA6IHt9LFxuICAgICAgICBtb2RlIDogd2luZG93LkNWTS5tb2RlXG5cdH07XG4gICAgXG4gICAgaWYocGFyYW1zLnN0YXRpY1JlbmRlciAmJiBzY29wZS5tb2RlICE9ICdlZGl0JylcbiAgICAgICAgcmV0dXJuO1xuXG5cdHZhciAkZWxlID0gJGNvbnRhaW5lciA9ICQoY29udGFpbmVyKTtcblxuICAgIHByZXBhcmVTZXRTZWN0aW9uKGZ1bmN0aW9uKCl7XG4gICAgICAgIHByZXBhcmVBdHRycygpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgZWZmZWN0KCk7XG4gICAgfSlcblxuICAgIGZ1bmN0aW9uIHByZXBhcmVTZXRTZWN0aW9uKGNhbGxiYWNrKXtcbiAgICAgICAgY2hhbm5lbFN5bmNTZXJ2aWNlLnN5bmNTZXRTZWN0aW9uKHBhcmFtcywgZnVuY3Rpb24oc2VjdGlvbil7XG4gICAgICAgICAgICBzY29wZS5zZWN0aW9uID0gc2VjdGlvbjtcbiAgICAgICAgICAgIHNlY3Rpb24uc2VjdGlvbklkID0gXCJzZXQtXCIgKyBwYXJhbXMuc2V0S2V5ICsgXCItXCIgKyBwYXJhbXMuc2V0VmFsdWU7XG4gICAgICAgICAgICB1cGRhdGVBdHRyTG9jYWxseShzZWN0aW9uLCAnY3NzS2V5JywgJ3NldGxpc3QnKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXBhcmVBdHRycygpe1xuICAgICAgICB2YXIgc2VjdGlvbiA9IHNjb3BlLnNlY3Rpb247XG4gICAgXHRzY29wZS5hdHRycyA9IHtcbiAgICAgICAgICAgIHN0YXR1cyA6IGdldEF0dHIoc2VjdGlvbiwgJ3N0YXR1cycpLFxuICAgICAgICAgICAgY3NzVmFsdWUgOiBnZXRBdHRyKHNlY3Rpb24sICdjc3NWYWx1ZScpLFxuICAgICAgICAgICAgdGl0bGUgOiBnZXRBdHRyKHNlY3Rpb24sICd0aXRsZScpLFxuICAgICAgICAgICAgZGlzcGxheVRpdGxlIDogIGdldEF0dHIoc2VjdGlvbiwgJ2Rpc3BsYXlUaXRsZScpICE9ICdubycsXG4gICAgICAgICAgICB3aWR0aCA6IGdldEF0dHIoc2VjdGlvbiwgJ3dpZHRoJykgPT0gJ2Z1bGwnID8gJzEwMCUnIDogJzEwMDBweCcsXG4gICAgICAgICAgICB0ZXh0QWxpZ24gOiBnZXRBdHRyKHNlY3Rpb24sICd0ZXh0QWxpZ24nKSA/IGdldEF0dHIoc2VjdGlvbiwgJ3RleHRBbGlnbicpIDogJ2NlbnRlcicsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgOiBnZXRBdHRyKHNlY3Rpb24sICdiYWNrZ3JvdW5kQ29sb3InKSxcbiAgICAgICAgICAgIGJhY2tncm91bmRJbWcgOiBnZXRBdHRyKHNlY3Rpb24sICdiYWNrZ3JvdW5kSW1nJykgPyBnZXRBdHRyKHNlY3Rpb24sICdiYWNrZ3JvdW5kSW1nJykgOiAnJyxcbiAgICAgICAgICAgIGNhcm91c2VsIDogZ2V0QXR0cihzZWN0aW9uLCAnY2Fyb3VzZWwnKSA9PSAneWVzJyxcbiAgICAgICAgICAgIGNhcm91c2VsTnVtYmVyIDogZ2V0QXR0cihzZWN0aW9uLCAnY2Fyb3VzZWxOdW1iZXInKSA/IGdldEF0dHIoc2VjdGlvbiwgJ2Nhcm91c2VsTnVtYmVyJykgOiAxLFxuICAgICAgICAgICAgY2Fyb3VzZWxBdXRvUGxheSA6IGdldEF0dHIoc2VjdGlvbiwgJ2Nhcm91c2VsQXV0b1BsYXknKSA9PSAneWVzJyxcbiAgICAgICAgICAgIHBhcnRpY2lwYW50TGltaXRlZCA6IGdldEF0dHIoc2VjdGlvbiwgJ3BhcnRpY2lwYW50TGltaXRlZCcpID09ICd5ZXMnLFxuICAgICAgICAgICAgY29udGVudFN5bmNUb2dnbGUgOiBnZXRBdHRyKHNlY3Rpb24sICdjb250ZW50U3luYycpICE9ICcnIHx8IGdldEF0dHIoc2VjdGlvbiwgJ2V2ZW50U3luY0tleScpLFxuICAgICAgICAgICAgY29udGVudFN5bmMgOiBnZXRBdHRyKHNlY3Rpb24sICdjb250ZW50U3luYycpID09ICd5ZXMnLFxuICAgICAgICAgICAgc3luY1R5cGUgOiBnZXRBdHRyKHNlY3Rpb24sICdzeW5jVHlwZScpLFxuICAgICAgICAgICAgc3luY1NldEtleSA6IGdldEF0dHIoc2VjdGlvbiwgJ3N5bmNTZXRLZXknKSxcbiAgICAgICAgICAgIHN5bmNTZXRWYWx1ZSA6IGdldEF0dHIoc2VjdGlvbiwgJ3N5bmNTZXRWYWx1ZScpXG4gICAgICAgIH07XG4gICAgICBcdHNjb3BlLmF0dHJzLmNzcyA9IHRlbXBsYXRlUmVuZGVyKHNjb3BlLCAnc3R5bGVfc2VjdGlvbicpO1xuICAgICAgICBcbiAgICAgICAgaWYoZ2V0QXR0cihzZWN0aW9uLCAnY3NzS2V5Jykpe1xuICAgICAgICAgICAgc2NvcGUuYXR0cnMuY3NzICs9IHRlbXBsYXRlUmVuZGVyKHNjb3BlLCAnc3R5bGVfJyArIGdldEF0dHIoc2VjdGlvbiwgJ2Nzc0tleScpICsgJ19zZWN0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoc2NvcGUuYXR0cnMuY3NzVmFsdWUpe1xuICAgICAgICAgICAgc2NvcGUuYXR0cnMuY3NzID0gIHNjb3BlLmF0dHJzLmNzcyArIGludGVycG9sYXRlKHNjb3BlLmF0dHJzLmNzc1ZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZihzY29wZS5hdHRycy5jYXJvdXNlbCl7XG4gICAgICAgICAgICBzY29wZS5hdHRycy5jc3MgPSAgc2NvcGUuYXR0cnMuY3NzICsgdGVtcGxhdGVSZW5kZXIoc2NvcGUsICdzdHlsZVNsaWNrJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXIoKXtcbiAgICAgICAgJGNvbnRhaW5lci5maW5kKFwiLmFtZXJpY2Fuby1zZWN0aW9uXCIpLnJlbW92ZSgpO1xuICAgICBcdCRlbGUgPSAkKHRlbXBsYXRlUmVuZGVyKHNjb3BlLCAnc2VjdGlvbicpKS5hcHBlbmRUbygkY29udGFpbmVyKTtcblxuICAgICAgICAkZWxlLmZpbmQoXCIuc2VjdGlvbi1zdHlsZS1jb250YWluZXJcIikuaHRtbChzY29wZS5hdHRycy5jc3MpO1xuXG4gICAgICAgIGlmKGdldEF0dHIoc2NvcGUuc2VjdGlvbiwgJ2Rpc3BsYXlUaXRsZScpICE9ICdubycgJiYgZ2V0QXR0cihzY29wZS5zZWN0aW9uLCAndGl0bGUnKSl7XG4gICAgICAgICAgICB2YXIgdGl0bGUgPSAgdGV4dEVsZW1lbnQoe3ZhbHVlOiBnZXRBdHRyKHNjb3BlLnNlY3Rpb24sICd0aXRsZScpfSk7XG4gICAgICAgICAgICBFbGVtZW50KHRpdGxlLCAkZWxlLmZpbmQoXCIuc2VjdGlvbi10aXRsZS1lbGVtZW50XCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uZWFjaChzY29wZS5zZWN0aW9uLmRpdmlzaW9ucywgZnVuY3Rpb24oZGl2aXNpb24sIGluZGV4KXtcbiAgICAgICAgICAgIGRpdmlzaW9uLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICBpZihwYXJhbXMuZGl2aXNpb25MaW5rKXtcbiAgICAgICAgICAgICAgICBkaXZpc2lvbi5saW5rID0gcGFyYW1zLmRpdmlzaW9uTGluazsgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgRGl2aXNpb24oZGl2aXNpb24sIHNjb3BlLm1vZGUsICRlbGUuZmluZChcIi5kaXZpc2lvbnMtY29udGFpbmVyXCIpKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlZmZlY3QoKXtcbiAgICAgICAgaWYoc2NvcGUuYXR0cnMuY2Fyb3VzZWwpe1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBhdXRvcGxheSA6IHNjb3BlLmF0dHJzLmNhcm91c2VsQXV0b1BsYXlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIENhcm91c2VsKHBhcmFtcyAsJGVsZS5maW5kKFwiLmRpdmlzaW9ucy1jb250YWluZXJcIikpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXR0cihlbGVtZW50LCBrZXkpe1xuXHRcdHZhciBhdHRyID0gXy5maW5kKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cil7XG5cdCAgICAgICAgcmV0dXJuIGF0dHIua2V5ID09IGtleTtcblx0ICAgIH0pXG5cdCAgICBpZihhdHRyKXtcblx0ICAgICAgICByZXR1cm4gYXR0ci52YWx1ZTtcblx0ICAgIH1lbHNle1xuXHQgICAgICAgIHJldHVybiBcIlwiO1xuXHQgICAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gaW50ZXJwb2xhdGUoY3NzKXtcbiAgICAgICAgdmFyIHMgPSBcIiNhbS1cIiArIHNjb3BlLnNlY3Rpb24uc2VjdGlvbklkICsgXCItc2VjdGlvblwiO1xuICAgICAgICByZXR1cm4gJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj4nICsgY3NzLnJlcGxhY2UoLyMjL2csIHMpICsgJzwvc3R5bGU+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXh0RWxlbWVudChwYXJhbXMpe1xuICAgICAgICB2YXIgcGFyYW1zID0gcGFyYW1zID8gcGFyYW1zIDoge307XG4gICAgICAgIHBhcmFtcy5hdHRyaWJ1dGVzID0gcGFyYW1zLmF0dHJpYnV0ZXMgPyBwYXJhbXMuYXR0cmlidXRlcyA6IFtdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5IDogXCJcIixcbiAgICAgICAgICAgIHZhbHVlIDogcGFyYW1zLnZhbHVlID8gcGFyYW1zLnZhbHVlIDogXCJ0ZXh0XCIsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzIDogXy51bmlvbihbe1xuICAgICAgICAgICAgICAgIGtleSA6IFwidHlwZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlIDogcGFyYW1zLnR5cGUgPyBwYXJhbXMudHlwZSA6ICd0ZXh0J1xuICAgICAgICAgICAgfV0sIHBhcmFtcy5hdHRyaWJ1dGVzKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQXR0ckxvY2FsbHkoZWxlbWVudCwga2V5LCB2YWx1ZSl7XG4gICAgICAgIHZhciB0ID0gXy5maW5kKGVsZW1lbnQuYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cil7XG4gICAgICAgICAgICByZXR1cm4gYXR0ci5rZXkgPT0ga2V5O1xuICAgICAgICB9KVxuICAgICAgICBpZih0KXtcbiAgICAgICAgICAgIHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBlbGVtZW50LmF0dHJpYnV0ZXMucHVzaCh7a2V5OmtleSwgdmFsdWU6dmFsdWV9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXRTZWN0aW9uOyIsInZhciB0ZW1wbGF0ZVJlbmRlciA9IHJlcXVpcmUoXCIuL3NlcnZpY2UvdGVtcGxhdGVSZW5kZXJcIik7XG5cbmZ1bmN0aW9uIHRleHRFbGVtZW50KGVsZW1lbnQpIHtcblx0dmFyIG5vbkxpbmtEb20xID0gWyc8ZGl2IHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2s7IHdpZHRoOjEwMCU7XCI+PHA+JywgJzwvcD48L2Rpdj4nXTtcblx0dmFyIGxpbmtEb24xID0gWyc8YSBocmVmPVwiJyArIGdldEF0dHIoZWxlbWVudCwgJ2xpbmtVcmwnKSArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj48c3Bhbj4nLCAnPC9zcGFuPjwvYT4nXTtcblx0dmFyIGRvbTEgPSBnZXRBdHRyKGVsZW1lbnQsICdsaW5rVXJsJykgPyBsaW5rRG9uMSA6IG5vbkxpbmtEb20xO1xuXHR2YXIgaHRtbCA9IGRvbTFbMF0gKyBlbGVtZW50LnZhbHVlICsgZG9tMVsxXTtcblx0cmV0dXJuIHRlbXBsYXRlUmVuZGVyKHtodG1sOmh0bWx9LCAndGV4dEVsZW1lbnQnKTtcblxuICAgIGZ1bmN0aW9uIGdldEF0dHIoZWxlbWVudCwga2V5KXtcblx0XHR2YXIgYXR0ciA9IF8uZmluZChlbGVtZW50LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpe1xuXHQgICAgICAgIHJldHVybiBhdHRyLmtleSA9PSBrZXk7XG5cdCAgICB9KVxuXHQgICAgaWYoYXR0cil7XG5cdCAgICAgICAgcmV0dXJuIGF0dHIudmFsdWU7XG5cdCAgICB9ZWxzZXtcblx0ICAgICAgICByZXR1cm4gXCJcIjtcblx0ICAgIH1cblx0fVxufVxubW9kdWxlLmV4cG9ydHMgPSB0ZXh0RWxlbWVudDsiLCIoZnVuY3Rpb24oKXt2YXIgcnNwbGl0PWZ1bmN0aW9uKHN0cmluZyxyZWdleCl7dmFyIHJlc3VsdD1yZWdleC5leGVjKHN0cmluZykscmV0QXJyPW5ldyBBcnJheSgpLGZpcnN0X2lkeCxsYXN0X2lkeCxmaXJzdF9iaXQ7d2hpbGUocmVzdWx0IT1udWxsKXtmaXJzdF9pZHg9cmVzdWx0LmluZGV4O2xhc3RfaWR4PXJlZ2V4Lmxhc3RJbmRleDtpZigoZmlyc3RfaWR4KSE9MCl7Zmlyc3RfYml0PXN0cmluZy5zdWJzdHJpbmcoMCxmaXJzdF9pZHgpO3JldEFyci5wdXNoKHN0cmluZy5zdWJzdHJpbmcoMCxmaXJzdF9pZHgpKTtzdHJpbmc9c3RyaW5nLnNsaWNlKGZpcnN0X2lkeCl9cmV0QXJyLnB1c2gocmVzdWx0WzBdKTtzdHJpbmc9c3RyaW5nLnNsaWNlKHJlc3VsdFswXS5sZW5ndGgpO3Jlc3VsdD1yZWdleC5leGVjKHN0cmluZyl9aWYoIXN0cmluZz09XCJcIil7cmV0QXJyLnB1c2goc3RyaW5nKX1yZXR1cm4gcmV0QXJyfSxjaG9wPWZ1bmN0aW9uKHN0cmluZyl7cmV0dXJuIHN0cmluZy5zdWJzdHIoMCxzdHJpbmcubGVuZ3RoLTEpfSxleHRlbmQ9ZnVuY3Rpb24oZCxzKXtmb3IodmFyIG4gaW4gcyl7aWYocy5oYXNPd25Qcm9wZXJ0eShuKSl7ZFtuXT1zW25dfX19O0VKUz1mdW5jdGlvbihvcHRpb25zKXtvcHRpb25zPXR5cGVvZiBvcHRpb25zPT1cInN0cmluZ1wiP3t2aWV3Om9wdGlvbnN9Om9wdGlvbnM7dGhpcy5zZXRfb3B0aW9ucyhvcHRpb25zKTtpZihvcHRpb25zLnByZWNvbXBpbGVkKXt0aGlzLnRlbXBsYXRlPXt9O3RoaXMudGVtcGxhdGUucHJvY2Vzcz1vcHRpb25zLnByZWNvbXBpbGVkO0VKUy51cGRhdGUodGhpcy5uYW1lLHRoaXMpO3JldHVybiB9aWYob3B0aW9ucy5lbGVtZW50KXtpZih0eXBlb2Ygb3B0aW9ucy5lbGVtZW50PT1cInN0cmluZ1wiKXt2YXIgbmFtZT1vcHRpb25zLmVsZW1lbnQ7b3B0aW9ucy5lbGVtZW50PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMuZWxlbWVudCk7aWYob3B0aW9ucy5lbGVtZW50PT1udWxsKXt0aHJvdyBuYW1lK1wiZG9lcyBub3QgZXhpc3QhXCJ9fWlmKG9wdGlvbnMuZWxlbWVudC52YWx1ZSl7dGhpcy50ZXh0PW9wdGlvbnMuZWxlbWVudC52YWx1ZX1lbHNle3RoaXMudGV4dD1vcHRpb25zLmVsZW1lbnQuaW5uZXJIVE1MfXRoaXMubmFtZT1vcHRpb25zLmVsZW1lbnQuaWQ7dGhpcy50eXBlPVwiW1wifWVsc2V7aWYob3B0aW9ucy51cmwpe29wdGlvbnMudXJsPUVKUy5lbmRFeHQob3B0aW9ucy51cmwsdGhpcy5leHRNYXRjaCk7dGhpcy5uYW1lPXRoaXMubmFtZT90aGlzLm5hbWU6b3B0aW9ucy51cmw7dmFyIHVybD1vcHRpb25zLnVybDt2YXIgdGVtcGxhdGU9RUpTLmdldCh0aGlzLm5hbWUsdGhpcy5jYWNoZSk7aWYodGVtcGxhdGUpe3JldHVybiB0ZW1wbGF0ZX1pZih0ZW1wbGF0ZT09RUpTLklOVkFMSURfUEFUSCl7cmV0dXJuIG51bGx9dHJ5e3RoaXMudGV4dD1FSlMucmVxdWVzdCh1cmwrKHRoaXMuY2FjaGU/XCJcIjpcIj9cIitNYXRoLnJhbmRvbSgpKSl9Y2F0Y2goZSl7fWlmKHRoaXMudGV4dD09bnVsbCl7dGhyb3cgKHt0eXBlOlwiRUpTXCIsbWVzc2FnZTpcIlRoZXJlIGlzIG5vIHRlbXBsYXRlIGF0IFwiK3VybH0pfX19dmFyIHRlbXBsYXRlPW5ldyBFSlMuQ29tcGlsZXIodGhpcy50ZXh0LHRoaXMudHlwZSk7dGVtcGxhdGUuY29tcGlsZShvcHRpb25zLHRoaXMubmFtZSk7RUpTLnVwZGF0ZSh0aGlzLm5hbWUsdGhpcyk7dGhpcy50ZW1wbGF0ZT10ZW1wbGF0ZX07RUpTLnByb3RvdHlwZT17cmVuZGVyOmZ1bmN0aW9uKG9iamVjdCxleHRyYV9oZWxwZXJzKXtvYmplY3Q9b2JqZWN0fHx7fTt0aGlzLl9leHRyYV9oZWxwZXJzPWV4dHJhX2hlbHBlcnM7dmFyIHY9bmV3IEVKUy5IZWxwZXJzKG9iamVjdCxleHRyYV9oZWxwZXJzfHx7fSk7cmV0dXJuIHRoaXMudGVtcGxhdGUucHJvY2Vzcy5jYWxsKG9iamVjdCxvYmplY3Qsdil9LHVwZGF0ZTpmdW5jdGlvbihlbGVtZW50LG9wdGlvbnMpe2lmKHR5cGVvZiBlbGVtZW50PT1cInN0cmluZ1wiKXtlbGVtZW50PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpfWlmKG9wdGlvbnM9PW51bGwpe190ZW1wbGF0ZT10aGlzO3JldHVybiBmdW5jdGlvbihvYmplY3Qpe0VKUy5wcm90b3R5cGUudXBkYXRlLmNhbGwoX3RlbXBsYXRlLGVsZW1lbnQsb2JqZWN0KX19aWYodHlwZW9mIG9wdGlvbnM9PVwic3RyaW5nXCIpe3BhcmFtcz17fTtwYXJhbXMudXJsPW9wdGlvbnM7X3RlbXBsYXRlPXRoaXM7cGFyYW1zLm9uQ29tcGxldGU9ZnVuY3Rpb24ocmVxdWVzdCl7dmFyIG9iamVjdD1ldmFsKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtFSlMucHJvdG90eXBlLnVwZGF0ZS5jYWxsKF90ZW1wbGF0ZSxlbGVtZW50LG9iamVjdCl9O0VKUy5hamF4X3JlcXVlc3QocGFyYW1zKX1lbHNle2VsZW1lbnQuaW5uZXJIVE1MPXRoaXMucmVuZGVyKG9wdGlvbnMpfX0sb3V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGVtcGxhdGUub3V0fSxzZXRfb3B0aW9uczpmdW5jdGlvbihvcHRpb25zKXt0aGlzLnR5cGU9b3B0aW9ucy50eXBlfHxFSlMudHlwZTt0aGlzLmNhY2hlPW9wdGlvbnMuY2FjaGUhPW51bGw/b3B0aW9ucy5jYWNoZTpFSlMuY2FjaGU7dGhpcy50ZXh0PW9wdGlvbnMudGV4dHx8bnVsbDt0aGlzLm5hbWU9b3B0aW9ucy5uYW1lfHxudWxsO3RoaXMuZXh0PW9wdGlvbnMuZXh0fHxFSlMuZXh0O3RoaXMuZXh0TWF0Y2g9bmV3IFJlZ0V4cCh0aGlzLmV4dC5yZXBsYWNlKC9cXC4vLFwiLlwiKSl9fTtFSlMuZW5kRXh0PWZ1bmN0aW9uKHBhdGgsbWF0Y2gpe2lmKCFwYXRoKXtyZXR1cm4gbnVsbH1tYXRjaC5sYXN0SW5kZXg9MDtyZXR1cm4gcGF0aCsobWF0Y2gudGVzdChwYXRoKT9cIlwiOnRoaXMuZXh0KX07RUpTLlNjYW5uZXI9ZnVuY3Rpb24oc291cmNlLGxlZnQscmlnaHQpe2V4dGVuZCh0aGlzLHtsZWZ0X2RlbGltaXRlcjpsZWZ0K1wiJVwiLHJpZ2h0X2RlbGltaXRlcjpcIiVcIityaWdodCxkb3VibGVfbGVmdDpsZWZ0K1wiJSVcIixkb3VibGVfcmlnaHQ6XCIlJVwiK3JpZ2h0LGxlZnRfZXF1YWw6bGVmdCtcIiU9XCIsbGVmdF9jb21tZW50OmxlZnQrXCIlI1wifSk7dGhpcy5TcGxpdFJlZ2V4cD1sZWZ0PT1cIltcIj8vKFxcWyUlKXwoJSVcXF0pfChcXFslPSl8KFxcWyUjKXwoXFxbJSl8KCVcXF1cXG4pfCglXFxdKXwoXFxuKS86bmV3IFJlZ0V4cChcIihcIit0aGlzLmRvdWJsZV9sZWZ0K1wiKXwoJSVcIit0aGlzLmRvdWJsZV9yaWdodCtcIil8KFwiK3RoaXMubGVmdF9lcXVhbCtcIil8KFwiK3RoaXMubGVmdF9jb21tZW50K1wiKXwoXCIrdGhpcy5sZWZ0X2RlbGltaXRlcitcIil8KFwiK3RoaXMucmlnaHRfZGVsaW1pdGVyK1wiXFxuKXwoXCIrdGhpcy5yaWdodF9kZWxpbWl0ZXIrXCIpfChcXG4pXCIpO3RoaXMuc291cmNlPXNvdXJjZTt0aGlzLnN0YWc9bnVsbDt0aGlzLmxpbmVzPTB9O0VKUy5TY2FubmVyLnRvX3RleHQ9ZnVuY3Rpb24oaW5wdXQpe2lmKGlucHV0PT1udWxsfHxpbnB1dD09PXVuZGVmaW5lZCl7cmV0dXJuXCJcIn1pZihpbnB1dCBpbnN0YW5jZW9mIERhdGUpe3JldHVybiBpbnB1dC50b0RhdGVTdHJpbmcoKX1pZihpbnB1dC50b1N0cmluZyl7cmV0dXJuIGlucHV0LnRvU3RyaW5nKCl9cmV0dXJuXCJcIn07RUpTLlNjYW5uZXIucHJvdG90eXBlPXtzY2FuOmZ1bmN0aW9uKGJsb2NrKXtzY2FubGluZT10aGlzLnNjYW5saW5lO3JlZ2V4PXRoaXMuU3BsaXRSZWdleHA7aWYoIXRoaXMuc291cmNlPT1cIlwiKXt2YXIgc291cmNlX3NwbGl0PXJzcGxpdCh0aGlzLnNvdXJjZSwvXFxuLyk7Zm9yKHZhciBpPTA7aTxzb3VyY2Vfc3BsaXQubGVuZ3RoO2krKyl7dmFyIGl0ZW09c291cmNlX3NwbGl0W2ldO3RoaXMuc2NhbmxpbmUoaXRlbSxyZWdleCxibG9jayl9fX0sc2NhbmxpbmU6ZnVuY3Rpb24obGluZSxyZWdleCxibG9jayl7dGhpcy5saW5lcysrO3ZhciBsaW5lX3NwbGl0PXJzcGxpdChsaW5lLHJlZ2V4KTtmb3IodmFyIGk9MDtpPGxpbmVfc3BsaXQubGVuZ3RoO2krKyl7dmFyIHRva2VuPWxpbmVfc3BsaXRbaV07aWYodG9rZW4hPW51bGwpe3RyeXtibG9jayh0b2tlbix0aGlzKX1jYXRjaChlKXt0aHJvdyB7dHlwZTpcIkVKUy5TY2FubmVyXCIsbGluZTp0aGlzLmxpbmVzfX19fX19O0VKUy5CdWZmZXI9ZnVuY3Rpb24ocHJlX2NtZCxwb3N0X2NtZCl7dGhpcy5saW5lPW5ldyBBcnJheSgpO3RoaXMuc2NyaXB0PVwiXCI7dGhpcy5wcmVfY21kPXByZV9jbWQ7dGhpcy5wb3N0X2NtZD1wb3N0X2NtZDtmb3IodmFyIGk9MDtpPHRoaXMucHJlX2NtZC5sZW5ndGg7aSsrKXt0aGlzLnB1c2gocHJlX2NtZFtpXSl9fTtFSlMuQnVmZmVyLnByb3RvdHlwZT17cHVzaDpmdW5jdGlvbihjbWQpe3RoaXMubGluZS5wdXNoKGNtZCl9LGNyOmZ1bmN0aW9uKCl7dGhpcy5zY3JpcHQ9dGhpcy5zY3JpcHQrdGhpcy5saW5lLmpvaW4oXCI7IFwiKTt0aGlzLmxpbmU9bmV3IEFycmF5KCk7dGhpcy5zY3JpcHQ9dGhpcy5zY3JpcHQrXCJcXG5cIn0sY2xvc2U6ZnVuY3Rpb24oKXtpZih0aGlzLmxpbmUubGVuZ3RoPjApe2Zvcih2YXIgaT0wO2k8dGhpcy5wb3N0X2NtZC5sZW5ndGg7aSsrKXt0aGlzLnB1c2gocHJlX2NtZFtpXSl9dGhpcy5zY3JpcHQ9dGhpcy5zY3JpcHQrdGhpcy5saW5lLmpvaW4oXCI7IFwiKTtsaW5lPW51bGx9fX07RUpTLkNvbXBpbGVyPWZ1bmN0aW9uKHNvdXJjZSxsZWZ0KXt0aGlzLnByZV9jbWQ9W1widmFyIF9fX1ZpZXdPID0gW107XCJdO3RoaXMucG9zdF9jbWQ9bmV3IEFycmF5KCk7dGhpcy5zb3VyY2U9XCIgXCI7aWYoc291cmNlIT1udWxsKXtpZih0eXBlb2Ygc291cmNlPT1cInN0cmluZ1wiKXtzb3VyY2U9c291cmNlLnJlcGxhY2UoL1xcclxcbi9nLFwiXFxuXCIpO3NvdXJjZT1zb3VyY2UucmVwbGFjZSgvXFxyL2csXCJcXG5cIik7dGhpcy5zb3VyY2U9c291cmNlfWVsc2V7aWYoc291cmNlLmlubmVySFRNTCl7dGhpcy5zb3VyY2U9c291cmNlLmlubmVySFRNTH19aWYodHlwZW9mIHRoaXMuc291cmNlIT1cInN0cmluZ1wiKXt0aGlzLnNvdXJjZT1cIlwifX1sZWZ0PWxlZnR8fFwiPFwiO3ZhciByaWdodD1cIj5cIjtzd2l0Y2gobGVmdCl7Y2FzZVwiW1wiOnJpZ2h0PVwiXVwiO2JyZWFrO2Nhc2VcIjxcIjpicmVhaztkZWZhdWx0OnRocm93IGxlZnQrXCIgaXMgbm90IGEgc3VwcG9ydGVkIGRlbGltaW5hdG9yXCI7YnJlYWt9dGhpcy5zY2FubmVyPW5ldyBFSlMuU2Nhbm5lcih0aGlzLnNvdXJjZSxsZWZ0LHJpZ2h0KTt0aGlzLm91dD1cIlwifTtFSlMuQ29tcGlsZXIucHJvdG90eXBlPXtjb21waWxlOmZ1bmN0aW9uKG9wdGlvbnMsbmFtZSl7b3B0aW9ucz1vcHRpb25zfHx7fTt0aGlzLm91dD1cIlwiO3ZhciBwdXRfY21kPVwiX19fVmlld08ucHVzaChcIjt2YXIgaW5zZXJ0X2NtZD1wdXRfY21kO3ZhciBidWZmPW5ldyBFSlMuQnVmZmVyKHRoaXMucHJlX2NtZCx0aGlzLnBvc3RfY21kKTt2YXIgY29udGVudD1cIlwiO3ZhciBjbGVhbj1mdW5jdGlvbihjb250ZW50KXtjb250ZW50PWNvbnRlbnQucmVwbGFjZSgvXFxcXC9nLFwiXFxcXFxcXFxcIik7Y29udGVudD1jb250ZW50LnJlcGxhY2UoL1xcbi9nLFwiXFxcXG5cIik7Y29udGVudD1jb250ZW50LnJlcGxhY2UoL1wiL2csJ1xcXFxcIicpO3JldHVybiBjb250ZW50fTt0aGlzLnNjYW5uZXIuc2NhbihmdW5jdGlvbih0b2tlbixzY2FubmVyKXtpZihzY2FubmVyLnN0YWc9PW51bGwpe3N3aXRjaCh0b2tlbil7Y2FzZVwiXFxuXCI6Y29udGVudD1jb250ZW50K1wiXFxuXCI7YnVmZi5wdXNoKHB1dF9jbWQrJ1wiJytjbGVhbihjb250ZW50KSsnXCIpOycpO2J1ZmYuY3IoKTtjb250ZW50PVwiXCI7YnJlYWs7Y2FzZSBzY2FubmVyLmxlZnRfZGVsaW1pdGVyOmNhc2Ugc2Nhbm5lci5sZWZ0X2VxdWFsOmNhc2Ugc2Nhbm5lci5sZWZ0X2NvbW1lbnQ6c2Nhbm5lci5zdGFnPXRva2VuO2lmKGNvbnRlbnQubGVuZ3RoPjApe2J1ZmYucHVzaChwdXRfY21kKydcIicrY2xlYW4oY29udGVudCkrJ1wiKScpfWNvbnRlbnQ9XCJcIjticmVhaztjYXNlIHNjYW5uZXIuZG91YmxlX2xlZnQ6Y29udGVudD1jb250ZW50K3NjYW5uZXIubGVmdF9kZWxpbWl0ZXI7YnJlYWs7ZGVmYXVsdDpjb250ZW50PWNvbnRlbnQrdG9rZW47YnJlYWt9fWVsc2V7c3dpdGNoKHRva2VuKXtjYXNlIHNjYW5uZXIucmlnaHRfZGVsaW1pdGVyOnN3aXRjaChzY2FubmVyLnN0YWcpe2Nhc2Ugc2Nhbm5lci5sZWZ0X2RlbGltaXRlcjppZihjb250ZW50W2NvbnRlbnQubGVuZ3RoLTFdPT1cIlxcblwiKXtjb250ZW50PWNob3AoY29udGVudCk7YnVmZi5wdXNoKGNvbnRlbnQpO2J1ZmYuY3IoKX1lbHNle2J1ZmYucHVzaChjb250ZW50KX1icmVhaztjYXNlIHNjYW5uZXIubGVmdF9lcXVhbDpidWZmLnB1c2goaW5zZXJ0X2NtZCtcIihFSlMuU2Nhbm5lci50b190ZXh0KFwiK2NvbnRlbnQrXCIpKSlcIik7YnJlYWt9c2Nhbm5lci5zdGFnPW51bGw7Y29udGVudD1cIlwiO2JyZWFrO2Nhc2Ugc2Nhbm5lci5kb3VibGVfcmlnaHQ6Y29udGVudD1jb250ZW50K3NjYW5uZXIucmlnaHRfZGVsaW1pdGVyO2JyZWFrO2RlZmF1bHQ6Y29udGVudD1jb250ZW50K3Rva2VuO2JyZWFrfX19KTtpZihjb250ZW50Lmxlbmd0aD4wKXtidWZmLnB1c2gocHV0X2NtZCsnXCInK2NsZWFuKGNvbnRlbnQpKydcIiknKX1idWZmLmNsb3NlKCk7dGhpcy5vdXQ9YnVmZi5zY3JpcHQrXCI7XCI7dmFyIHRvX2JlX2V2YWxlZD1cIi8qXCIrbmFtZStcIiovdGhpcy5wcm9jZXNzID0gZnVuY3Rpb24oX0NPTlRFWFQsX1ZJRVcpIHsgdHJ5IHsgd2l0aChfVklFVykgeyB3aXRoIChfQ09OVEVYVCkge1wiK3RoaXMub3V0K1wiIHJldHVybiBfX19WaWV3Ty5qb2luKCcnKTt9fX1jYXRjaChlKXtlLmxpbmVOdW1iZXI9bnVsbDt0aHJvdyBlO319O1wiO3RyeXtldmFsKHRvX2JlX2V2YWxlZCl9Y2F0Y2goZSl7aWYodHlwZW9mIEpTTElOVCE9XCJ1bmRlZmluZWRcIil7SlNMSU5UKHRoaXMub3V0KTtmb3IodmFyIGk9MDtpPEpTTElOVC5lcnJvcnMubGVuZ3RoO2krKyl7dmFyIGVycm9yPUpTTElOVC5lcnJvcnNbaV07aWYoZXJyb3IucmVhc29uIT1cIlVubmVjZXNzYXJ5IHNlbWljb2xvbi5cIil7ZXJyb3IubGluZSsrO3ZhciBlPW5ldyBFcnJvcigpO2UubGluZU51bWJlcj1lcnJvci5saW5lO2UubWVzc2FnZT1lcnJvci5yZWFzb247aWYob3B0aW9ucy52aWV3KXtlLmZpbGVOYW1lPW9wdGlvbnMudmlld310aHJvdyBlfX19ZWxzZXt0aHJvdyBlfX19fTtFSlMuY29uZmlnPWZ1bmN0aW9uKG9wdGlvbnMpe0VKUy5jYWNoZT1vcHRpb25zLmNhY2hlIT1udWxsP29wdGlvbnMuY2FjaGU6RUpTLmNhY2hlO0VKUy50eXBlPW9wdGlvbnMudHlwZSE9bnVsbD9vcHRpb25zLnR5cGU6RUpTLnR5cGU7RUpTLmV4dD1vcHRpb25zLmV4dCE9bnVsbD9vcHRpb25zLmV4dDpFSlMuZXh0O3ZhciB0ZW1wbGF0ZXNfZGlyZWN0b3J5PUVKUy50ZW1wbGF0ZXNfZGlyZWN0b3J5fHx7fTtFSlMudGVtcGxhdGVzX2RpcmVjdG9yeT10ZW1wbGF0ZXNfZGlyZWN0b3J5O0VKUy5nZXQ9ZnVuY3Rpb24ocGF0aCxjYWNoZSl7aWYoY2FjaGU9PWZhbHNlKXtyZXR1cm4gbnVsbH1pZih0ZW1wbGF0ZXNfZGlyZWN0b3J5W3BhdGhdKXtyZXR1cm4gdGVtcGxhdGVzX2RpcmVjdG9yeVtwYXRoXX1yZXR1cm4gbnVsbH07RUpTLnVwZGF0ZT1mdW5jdGlvbihwYXRoLHRlbXBsYXRlKXtpZihwYXRoPT1udWxsKXtyZXR1cm4gfXRlbXBsYXRlc19kaXJlY3RvcnlbcGF0aF09dGVtcGxhdGV9O0VKUy5JTlZBTElEX1BBVEg9LTF9O0VKUy5jb25maWcoe2NhY2hlOnRydWUsdHlwZTpcIjxcIixleHQ6XCIuZWpzXCJ9KTtFSlMuSGVscGVycz1mdW5jdGlvbihkYXRhLGV4dHJhcyl7dGhpcy5fZGF0YT1kYXRhO3RoaXMuX2V4dHJhcz1leHRyYXM7ZXh0ZW5kKHRoaXMsZXh0cmFzKX07RUpTLkhlbHBlcnMucHJvdG90eXBlPXt2aWV3OmZ1bmN0aW9uKG9wdGlvbnMsZGF0YSxoZWxwZXJzKXtpZighaGVscGVycyl7aGVscGVycz10aGlzLl9leHRyYXN9aWYoIWRhdGEpe2RhdGE9dGhpcy5fZGF0YX1yZXR1cm4gbmV3IEVKUyhvcHRpb25zKS5yZW5kZXIoZGF0YSxoZWxwZXJzKX0sdG9fdGV4dDpmdW5jdGlvbihpbnB1dCxudWxsX3RleHQpe2lmKGlucHV0PT1udWxsfHxpbnB1dD09PXVuZGVmaW5lZCl7cmV0dXJuIG51bGxfdGV4dHx8XCJcIn1pZihpbnB1dCBpbnN0YW5jZW9mIERhdGUpe3JldHVybiBpbnB1dC50b0RhdGVTdHJpbmcoKX1pZihpbnB1dC50b1N0cmluZyl7cmV0dXJuIGlucHV0LnRvU3RyaW5nKCkucmVwbGFjZSgvXFxuL2csXCI8YnIgLz5cIikucmVwbGFjZSgvJycvZyxcIidcIil9cmV0dXJuXCJcIn19O0VKUy5uZXdSZXF1ZXN0PWZ1bmN0aW9uKCl7dmFyIGZhY3Rvcmllcz1bZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoXCJNc3htbDIuWE1MSFRUUFwiKX0sZnVuY3Rpb24oKXtyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCl9LGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIil9XTtmb3IodmFyIGk9MDtpPGZhY3Rvcmllcy5sZW5ndGg7aSsrKXt0cnl7dmFyIHJlcXVlc3Q9ZmFjdG9yaWVzW2ldKCk7aWYocmVxdWVzdCE9bnVsbCl7cmV0dXJuIHJlcXVlc3R9fWNhdGNoKGUpe2NvbnRpbnVlfX19O0VKUy5yZXF1ZXN0PWZ1bmN0aW9uKHBhdGgpe3ZhciByZXF1ZXN0PW5ldyBFSlMubmV3UmVxdWVzdCgpO3JlcXVlc3Qub3BlbihcIkdFVFwiLHBhdGgsZmFsc2UpO3RyeXtyZXF1ZXN0LnNlbmQobnVsbCl9Y2F0Y2goZSl7cmV0dXJuIG51bGx9aWYocmVxdWVzdC5zdGF0dXM9PTQwNHx8cmVxdWVzdC5zdGF0dXM9PTJ8fChyZXF1ZXN0LnN0YXR1cz09MCYmcmVxdWVzdC5yZXNwb25zZVRleHQ9PVwiXCIpKXtyZXR1cm4gbnVsbH1yZXR1cm4gcmVxdWVzdC5yZXNwb25zZVRleHR9O0VKUy5hamF4X3JlcXVlc3Q9ZnVuY3Rpb24ocGFyYW1zKXtwYXJhbXMubWV0aG9kPShwYXJhbXMubWV0aG9kP3BhcmFtcy5tZXRob2Q6XCJHRVRcIik7dmFyIHJlcXVlc3Q9bmV3IEVKUy5uZXdSZXF1ZXN0KCk7cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtpZihyZXF1ZXN0LnJlYWR5U3RhdGU9PTQpe2lmKHJlcXVlc3Quc3RhdHVzPT0yMDApe3BhcmFtcy5vbkNvbXBsZXRlKHJlcXVlc3QpfWVsc2V7cGFyYW1zLm9uQ29tcGxldGUocmVxdWVzdCl9fX07cmVxdWVzdC5vcGVuKHBhcmFtcy5tZXRob2QscGFyYW1zLnVybCk7cmVxdWVzdC5zZW5kKG51bGwpfX0pKCk7RUpTLkhlbHBlcnMucHJvdG90eXBlLmRhdGVfdGFnPWZ1bmN0aW9uKEMsTyxBKXtpZighKE8gaW5zdGFuY2VvZiBEYXRlKSl7Tz1uZXcgRGF0ZSgpfXZhciBCPVtcIkphbnVhcnlcIixcIkZlYnJ1YXJ5XCIsXCJNYXJjaFwiLFwiQXByaWxcIixcIk1heVwiLFwiSnVuZVwiLFwiSnVseVwiLFwiQXVndXN0XCIsXCJTZXB0ZW1iZXJcIixcIk9jdG9iZXJcIixcIk5vdmVtYmVyXCIsXCJEZWNlbWJlclwiXTt2YXIgRz1bXSxEPVtdLFA9W107dmFyIEo9Ty5nZXRGdWxsWWVhcigpO3ZhciBIPU8uZ2V0TW9udGgoKTt2YXIgTj1PLmdldERhdGUoKTtmb3IodmFyIE09Si0xNTtNPEorMTU7TSsrKXtHLnB1c2goe3ZhbHVlOk0sdGV4dDpNfSl9Zm9yKHZhciBFPTA7RTwxMjtFKyspe0QucHVzaCh7dmFsdWU6KEUpLHRleHQ6QltFXX0pfWZvcih2YXIgST0wO0k8MzE7SSsrKXtQLnB1c2goe3ZhbHVlOihJKzEpLHRleHQ6KEkrMSl9KX12YXIgTD10aGlzLnNlbGVjdF90YWcoQytcIlt5ZWFyXVwiLEosRyx7aWQ6QytcIlt5ZWFyXVwifSk7dmFyIEY9dGhpcy5zZWxlY3RfdGFnKEMrXCJbbW9udGhdXCIsSCxELHtpZDpDK1wiW21vbnRoXVwifSk7dmFyIEs9dGhpcy5zZWxlY3RfdGFnKEMrXCJbZGF5XVwiLE4sUCx7aWQ6QytcIltkYXldXCJ9KTtyZXR1cm4gTCtGK0t9O0VKUy5IZWxwZXJzLnByb3RvdHlwZS5mb3JtX3RhZz1mdW5jdGlvbihCLEEpe0E9QXx8e307QS5hY3Rpb249QjtpZihBLm11bHRpcGFydD09dHJ1ZSl7QS5tZXRob2Q9XCJwb3N0XCI7QS5lbmN0eXBlPVwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwifXJldHVybiB0aGlzLnN0YXJ0X3RhZ19mb3IoXCJmb3JtXCIsQSl9O0VKUy5IZWxwZXJzLnByb3RvdHlwZS5mb3JtX3RhZ19lbmQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50YWdfZW5kKFwiZm9ybVwiKX07RUpTLkhlbHBlcnMucHJvdG90eXBlLmhpZGRlbl9maWVsZF90YWc9ZnVuY3Rpb24oQSxDLEIpe3JldHVybiB0aGlzLmlucHV0X2ZpZWxkX3RhZyhBLEMsXCJoaWRkZW5cIixCKX07RUpTLkhlbHBlcnMucHJvdG90eXBlLmlucHV0X2ZpZWxkX3RhZz1mdW5jdGlvbihBLEQsQyxCKXtCPUJ8fHt9O0IuaWQ9Qi5pZHx8QTtCLnZhbHVlPUR8fFwiXCI7Qi50eXBlPUN8fFwidGV4dFwiO0IubmFtZT1BO3JldHVybiB0aGlzLnNpbmdsZV90YWdfZm9yKFwiaW5wdXRcIixCKX07RUpTLkhlbHBlcnMucHJvdG90eXBlLmlzX2N1cnJlbnRfcGFnZT1mdW5jdGlvbihBKXtyZXR1cm4od2luZG93LmxvY2F0aW9uLmhyZWY9PUF8fHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZT09QT90cnVlOmZhbHNlKX07RUpTLkhlbHBlcnMucHJvdG90eXBlLmxpbmtfdG89ZnVuY3Rpb24oQixBLEMpe2lmKCFCKXt2YXIgQj1cIm51bGxcIn1pZighQyl7dmFyIEM9e319aWYoQy5jb25maXJtKXtDLm9uY2xpY2s9JyB2YXIgcmV0X2NvbmZpcm0gPSBjb25maXJtKFwiJytDLmNvbmZpcm0rJ1wiKTsgaWYoIXJldF9jb25maXJtKXsgcmV0dXJuIGZhbHNlO30gJztDLmNvbmZpcm09bnVsbH1DLmhyZWY9QTtyZXR1cm4gdGhpcy5zdGFydF90YWdfZm9yKFwiYVwiLEMpK0IrdGhpcy50YWdfZW5kKFwiYVwiKX07RUpTLkhlbHBlcnMucHJvdG90eXBlLnN1Ym1pdF9saW5rX3RvPWZ1bmN0aW9uKEIsQSxDKXtpZighQil7dmFyIEI9XCJudWxsXCJ9aWYoIUMpe3ZhciBDPXt9fUMub25jbGljaz1DLm9uY2xpY2t8fFwiXCI7aWYoQy5jb25maXJtKXtDLm9uY2xpY2s9JyB2YXIgcmV0X2NvbmZpcm0gPSBjb25maXJtKFwiJytDLmNvbmZpcm0rJ1wiKTsgaWYoIXJldF9jb25maXJtKXsgcmV0dXJuIGZhbHNlO30gJztDLmNvbmZpcm09bnVsbH1DLnZhbHVlPUI7Qy50eXBlPVwic3VibWl0XCI7Qy5vbmNsaWNrPUMub25jbGljaysoQT90aGlzLnVybF9mb3IoQSk6XCJcIikrXCJyZXR1cm4gZmFsc2U7XCI7cmV0dXJuIHRoaXMuc3RhcnRfdGFnX2ZvcihcImlucHV0XCIsQyl9O0VKUy5IZWxwZXJzLnByb3RvdHlwZS5saW5rX3RvX2lmPWZ1bmN0aW9uKEYsQixBLEQsQyxFKXtyZXR1cm4gdGhpcy5saW5rX3RvX3VubGVzcygoRj09ZmFsc2UpLEIsQSxELEMsRSl9O0VKUy5IZWxwZXJzLnByb3RvdHlwZS5saW5rX3RvX3VubGVzcz1mdW5jdGlvbihFLEIsQSxDLEQpe0M9Q3x8e307aWYoRSl7aWYoRCYmdHlwZW9mIEQ9PVwiZnVuY3Rpb25cIil7cmV0dXJuIEQoQixBLEMsRCl9ZWxzZXtyZXR1cm4gQn19ZWxzZXtyZXR1cm4gdGhpcy5saW5rX3RvKEIsQSxDKX19O0VKUy5IZWxwZXJzLnByb3RvdHlwZS5saW5rX3RvX3VubGVzc19jdXJyZW50PWZ1bmN0aW9uKEIsQSxDLEQpe0M9Q3x8e307cmV0dXJuIHRoaXMubGlua190b191bmxlc3ModGhpcy5pc19jdXJyZW50X3BhZ2UoQSksQixBLEMsRCl9O0VKUy5IZWxwZXJzLnByb3RvdHlwZS5wYXNzd29yZF9maWVsZF90YWc9ZnVuY3Rpb24oQSxDLEIpe3JldHVybiB0aGlzLmlucHV0X2ZpZWxkX3RhZyhBLEMsXCJwYXNzd29yZFwiLEIpfTtFSlMuSGVscGVycy5wcm90b3R5cGUuc2VsZWN0X3RhZz1mdW5jdGlvbihELEcsSCxGKXtGPUZ8fHt9O0YuaWQ9Ri5pZHx8RDtGLnZhbHVlPUc7Ri5uYW1lPUQ7dmFyIEI9XCJcIjtCKz10aGlzLnN0YXJ0X3RhZ19mb3IoXCJzZWxlY3RcIixGKTtmb3IodmFyIEU9MDtFPEgubGVuZ3RoO0UrKyl7dmFyIEM9SFtFXTt2YXIgQT17dmFsdWU6Qy52YWx1ZX07aWYoQy52YWx1ZT09Ryl7QS5zZWxlY3RlZD1cInNlbGVjdGVkXCJ9Qis9dGhpcy5zdGFydF90YWdfZm9yKFwib3B0aW9uXCIsQSkrQy50ZXh0K3RoaXMudGFnX2VuZChcIm9wdGlvblwiKX1CKz10aGlzLnRhZ19lbmQoXCJzZWxlY3RcIik7cmV0dXJuIEJ9O0VKUy5IZWxwZXJzLnByb3RvdHlwZS5zaW5nbGVfdGFnX2Zvcj1mdW5jdGlvbihBLEIpe3JldHVybiB0aGlzLnRhZyhBLEIsXCIvPlwiKX07RUpTLkhlbHBlcnMucHJvdG90eXBlLnN0YXJ0X3RhZ19mb3I9ZnVuY3Rpb24oQSxCKXtyZXR1cm4gdGhpcy50YWcoQSxCKX07RUpTLkhlbHBlcnMucHJvdG90eXBlLnN1Ym1pdF90YWc9ZnVuY3Rpb24oQSxCKXtCPUJ8fHt9O0IudHlwZT1CLnR5cGV8fFwic3VibWl0XCI7Qi52YWx1ZT1BfHxcIlN1Ym1pdFwiO3JldHVybiB0aGlzLnNpbmdsZV90YWdfZm9yKFwiaW5wdXRcIixCKX07RUpTLkhlbHBlcnMucHJvdG90eXBlLnRhZz1mdW5jdGlvbihDLEUsRCl7aWYoIUQpe3ZhciBEPVwiPlwifXZhciBCPVwiIFwiO2Zvcih2YXIgQSBpbiBFKXtpZihFW0FdIT1udWxsKXt2YXIgRj1FW0FdLnRvU3RyaW5nKCl9ZWxzZXt2YXIgRj1cIlwifWlmKEE9PVwiQ2xhc3NcIil7QT1cImNsYXNzXCJ9aWYoRi5pbmRleE9mKFwiJ1wiKSE9LTEpe0IrPUErJz1cIicrRisnXCIgJ31lbHNle0IrPUErXCI9J1wiK0YrXCInIFwifX1yZXR1cm5cIjxcIitDK0IrRH07RUpTLkhlbHBlcnMucHJvdG90eXBlLnRhZ19lbmQ9ZnVuY3Rpb24oQSl7cmV0dXJuXCI8L1wiK0ErXCI+XCJ9O0VKUy5IZWxwZXJzLnByb3RvdHlwZS50ZXh0X2FyZWFfdGFnPWZ1bmN0aW9uKEEsQyxCKXtCPUJ8fHt9O0IuaWQ9Qi5pZHx8QTtCLm5hbWU9Qi5uYW1lfHxBO0M9Q3x8XCJcIjtpZihCLnNpemUpe0IuY29scz1CLnNpemUuc3BsaXQoXCJ4XCIpWzBdO0Iucm93cz1CLnNpemUuc3BsaXQoXCJ4XCIpWzFdO2RlbGV0ZSBCLnNpemV9Qi5jb2xzPUIuY29sc3x8NTA7Qi5yb3dzPUIucm93c3x8NDtyZXR1cm4gdGhpcy5zdGFydF90YWdfZm9yKFwidGV4dGFyZWFcIixCKStDK3RoaXMudGFnX2VuZChcInRleHRhcmVhXCIpfTtFSlMuSGVscGVycy5wcm90b3R5cGUudGV4dF90YWc9RUpTLkhlbHBlcnMucHJvdG90eXBlLnRleHRfYXJlYV90YWc7RUpTLkhlbHBlcnMucHJvdG90eXBlLnRleHRfZmllbGRfdGFnPWZ1bmN0aW9uKEEsQyxCKXtyZXR1cm4gdGhpcy5pbnB1dF9maWVsZF90YWcoQSxDLFwidGV4dFwiLEIpfTtFSlMuSGVscGVycy5wcm90b3R5cGUudXJsX2Zvcj1mdW5jdGlvbihBKXtyZXR1cm4nd2luZG93LmxvY2F0aW9uPVwiJytBKydcIjsnfTtFSlMuSGVscGVycy5wcm90b3R5cGUuaW1nX3RhZz1mdW5jdGlvbihCLEMsQSl7QT1BfHx7fTtBLnNyYz1CO0EuYWx0PUM7cmV0dXJuIHRoaXMuc2luZ2xlX3RhZ19mb3IoXCJpbWdcIixBKX0iLCIvKipcclxuU2lkSlMgLSBKYXZhU2NyaXB0IEFuZCBDU1MgTGF6eSBMb2FkZXIgMC4xXHJcblxyXG5Db3B5cmlnaHQgKGMpIEFsZXhhbmRydSBNYXJhc3RlYW51IDxhbGV4YWhvbGljIFthdCkgZ21haWwgKGRvdF0gY29tPlxyXG5BbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5cclxuUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XHJcbm1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxyXG4gICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxyXG4gICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcbiAgICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XHJcbiAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcclxuICAgICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuICAgICogTmVpdGhlciB0aGUgbmFtZSBvZiBTaWRKUyBub3IgdGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5IGJlXHJcbiAgICAgIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXRcclxuICAgICAgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxyXG5cclxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EXHJcbkFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkVcclxuRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgQWxleGFuZHJ1IE1hcmFzdGVhbnUgQkUgTElBQkxFIEZPUiBBTllcclxuRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcclxuKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTO1xyXG5MT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkRcclxuT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcclxuKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcclxuU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXHJcblxyXG5cclxuU25pZmZpbmcgYnkgQm9yaXMgUG9wb2ZmIDxodHRwOi8vZ3Vlc2NobGEuY29tLz4gKHNlZSBodHRwOi8vZGVhbi5lZHdhcmRzLm5hbWUvd2VibG9nLzIwMDcvMDMvc25pZmYvKVxyXG5cclxuU28gd2h5IHNuaWZmPyBXZWxsLCB0aGUgc3RhdGUgb2YgdGhlIGJyb3dzZXIgaXMgcHJldHR5IGZ1Y2tlZCB1cDpcclxuT3BlcmE6XHJcbi0gc2NyaXB0OlxyXG4gICAgLSBkZXRlY3RzIGxvYWRcclxuICAgIC0gdHJpZ2dlcnMgbG9hZCwgcmVhZHlzdGF0ZWNoYW5nZVxyXG4tIGxpbms6XHJcbiAgICAtIGRldGVjdHMgbG9hZFxyXG4gICAgLSB0cmlnZ2VycyBsb2FkXHJcblNhZmFyaSwgQ2hyb21lLCBGaXJlZm94OlxyXG4tIHNjcmlwdDpcclxuICAgIC0gZGV0ZWN0cyBsb2FkXHJcbiAgICAtIHRyaWdnZXJzIGxvYWRcclxuLSBsaW5rOlxyXG4gICAgLSBkZXRlY3RzIGxvYWQgKFdlYktpdClcclxuICAgIC0gdHJpZ2dlcnMgTk9ORVxyXG5JRTg6XHJcbi0gc2NyaXB0OlxyXG4gICAgLSBkZXRlY3RzIHJlYWR5c3RhdGVjaGFuZ2VcclxuICAgIC0gdHJpZ2dlcnMgcmVhZHlzdGF0ZWNoYW5nZVxyXG4tIGxpbms6XHJcbiAgICAtIGRldGVjdHMgbG9hZCwgcmVhZHlzdGF0ZWNoYW5nZVxyXG4gICAgLSB0cmlnZ2VycyBsb2FkLCByZWFkeXN0YXRlY2hhbmdlXHJcbkFzc3VtZSBhbGwgdmVyc2lvbnMgb2YgSUUgc3VwcG9ydCByZWFkeXN0YXRlY2hhbmdlXHJcbiovXHJcbihmdW5jdGlvbigpIHtcclxuXHR2YXIgd2luID0gd2luZG93LFxyXG5cdFx0ZG9jID0gZG9jdW1lbnQsXHJcblx0XHRwcm90byA9ICdwcm90b3R5cGUnLFxyXG5cdFx0aGVhZCA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLFxyXG5cdFx0Ym9keSA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLFxyXG5cdFx0c25pZmYgPSAvKkBjY19vbiFAKi8xICsgLyg/OkdlY2tvfEFwcGxlV2ViS2l0KVxcLyhcXFMqKS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTsgLy8gMCAtIElFLCAxIC0gTywgMiAtIEdLL1dLXHJcblxyXG5cdHZhciBjcmVhdGVOb2RlID0gZnVuY3Rpb24odGFnLCBhdHRycykge1xyXG5cdFx0dmFyIGF0dHIsIG5vZGUgPSBkb2MuY3JlYXRlRWxlbWVudCh0YWcpO1xyXG5cdFx0Zm9yIChhdHRyIGluIGF0dHJzKSB7XHJcblx0XHRcdGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xyXG5cdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJzW2F0dHJdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5vZGU7XHJcblx0fTtcclxuXHJcblx0dmFyIGxvYWQgPSBmdW5jdGlvbih0eXBlLCB1cmxzLCBjYWxsYmFjaywgc2NvcGUpIHtcclxuXHRcdGlmICh0aGlzID09IHdpbikge1xyXG5cdFx0XHRyZXR1cm4gbmV3IGxvYWQodHlwZSwgdXJscywgY2FsbGJhY2ssIHNjb3BlKTtcclxuXHRcdH1cclxuXHJcblx0XHR1cmxzID0gKHR5cGVvZiB1cmxzID09ICdzdHJpbmcnID8gW3VybHNdIDogdXJscyk7XHJcblx0XHRzY29wZSA9IChzY29wZSA/IChzY29wZSkgOiAodHlwZSA9PSAnanMnID8gYm9keSA6IGhlYWQpKTtcclxuXHJcblx0XHR0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuXHRcdHRoaXMucXVldWUgPSBbXTtcclxuXHJcblx0XHR2YXIgbm9kZSwgaSA9IGxlbiA9IDAsIHRoYXQgPSB0aGlzO1xyXG5cclxuXHRcdGZvciAoaSA9IDAsIGxlbiA9IHVybHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0dGhpcy5xdWV1ZVtpXSA9IDE7XHJcblx0XHRcdGlmICh0eXBlID09ICdjc3MnKSB7XHJcblx0XHRcdFx0bm9kZSA9IGNyZWF0ZU5vZGUoJ2xpbmsnLCB7IHR5cGU6ICd0ZXh0L2NzcycsIHJlbDogJ3N0eWxlc2hlZXQnLCBocmVmOiB1cmxzW2ldIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdG5vZGUgPSBjcmVhdGVOb2RlKCdzY3JpcHQnLCB7IHR5cGU6ICd0ZXh0L2phdmFzY3JpcHQnLCBzcmM6IHVybHNbaV0gfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNjb3BlLmFwcGVuZENoaWxkKG5vZGUpO1xyXG5cclxuXHRcdFx0aWYgKHNuaWZmKSB7XHJcblx0XHRcdFx0aWYgKHR5cGUgPT0gJ2NzcycgJiYgc25pZmYgPT0gMikge1xyXG5cdFx0XHRcdFx0dmFyIGludGVydmFsSUQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHRub2RlLnNoZWV0LmNzc1J1bGVzO1xyXG5cdFx0XHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJRCk7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC5fX2NhbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Y2F0Y2ggKGV4KSB7fVxyXG5cdFx0XHRcdFx0fSwgMTAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRub2RlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHR0aGF0Ll9fY2FsbGJhY2soKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bm9kZS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmICgvXmxvYWRlZHxjb21wbGV0ZSQvLnRlc3QodGhpcy5yZWFkeVN0YXRlKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XHJcblx0XHRcdFx0XHRcdHRoYXQuX19jYWxsYmFjaygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cdGxvYWRbcHJvdG9dLl9fY2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0aGlzLnF1ZXVlLnBvcCgpICYmICh0aGlzLnF1ZXVlID09IDApKSB7IHRoaXMuY2FsbGJhY2soKTsgfVxyXG5cdH07XHJcblxyXG5cdHdpbmRvdy5TaWQgPSB7XHJcblx0XHRjc3M6IGZ1bmN0aW9uKHVybHMsIGNhbGxiYWNrLCBzY29wZSkge1xyXG5cdFx0XHRyZXR1cm4gbG9hZCgnY3NzJywgdXJscywgY2FsbGJhY2ssIHNjb3BlKTtcclxuXHRcdH0sXHJcblx0XHRqczogZnVuY3Rpb24odXJscywgY2FsbGJhY2ssIHNjb3BlKSB7XHJcblx0XHRcdHJldHVybiBsb2FkKCdqcycsIHVybHMsIGNhbGxiYWNrLCBzY29wZSk7XHJcblx0XHR9LFxyXG5cdFx0bG9hZDogZnVuY3Rpb24odHlwZSwgdXJscywgY2FsbGJhY2ssIHNjb3BlKSB7XHJcblx0XHRcdHJldHVybiBsb2FkKHR5cGUsIHVybHMsIGNhbGxiYWNrLCBzY29wZSk7XHJcblx0XHR9XHJcblx0fTtcclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCQpe1xuICAgICQuZ2V0UXVlcnkgPSBmdW5jdGlvbiggcXVlcnkgKSB7XG4gICAgICAgIGlmKCFxdWVyeSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIHF1ZXJ5ID0gcXVlcnkucmVwbGFjZSgvW1xcW10vLFwiXFxcXFxcW1wiKS5yZXBsYWNlKC9bXFxdXS8sXCJcXFxcXFxdXCIpO1xuICAgICAgICB2YXIgZXhwciA9IFwiW1xcXFw/Jl1cIitxdWVyeStcIj0oW14mI10qKVwiO1xuICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCBleHByICk7XG4gICAgICAgIHZhciByZXN1bHRzID0gcmVnZXguZXhlYyggd2luZG93LmxvY2F0aW9uLmhyZWYgKTtcbiAgICAgICAgaWYoIHJlc3VsdHMgIT09IG51bGwgKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0c1sxXTtcbiAgICAgICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG59KShqUXVlcnkpOyIsImZ1bmN0aW9uIGlzSW1hZ2VFbGVtZW50ICh0eXBlKXtcbiAgICBpZih0eXBlID09ICdpbWFnZScpe1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1RleHRFbGVtZW50ICh0eXBlKXtcbiAgICBpZih0eXBlID09ICdzZWN0aW9udGl0bGUnIHx8IHR5cGUgPT0gJ2l0ZW10aXRsZScgfHwgdHlwZSA9PSAndGV4dCcgfHwgdHlwZSA9PSAnZGVzY3JpcHRpb24nfHwgdHlwZSA9PSAnaWNvbnRleHQnICB8fCB0eXBlID09ICdsaW5rdGV4dCcpe1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc0h0bWxFbGVtZW50ICh0eXBlKXtcbiAgICBpZih0eXBlID09ICdodG1sJyl7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzUGVyc29uRWxlbWVudCAodHlwZSl7XG4gICAgaWYodHlwZSA9PSAncGVyc29uJyl7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ2hhbm5lbCh0eXBlLCBwYXJhbXMpIHtcbiAgICB2YXIgcGFyYW1zID0gcGFyYW1zID8gcGFyYW1zIDoge307XG4gICAgdmFyIGNoYW5uZWwgPSB7XG4gICAgICAgIHNlY3Rpb25zIDogW10sXG4gICAgICAgIGF0dHJpYnV0ZXMgOiBbe1xuICAgICAgICAgICAga2V5IDogXCJ0eXBlXCIsXG4gICAgICAgICAgICB2YWx1ZSA6ICcnXG4gICAgICAgIH1dXG4gICAgfVxuICAgIGlmKHR5cGUgPT0gJ2NoYW5uZWwnKXtcbiAgICAgICAgY2hhbm5lbC5zZWN0aW9ucy5wdXNoKGdlbmVyYXRlU2VjdGlvbignaGVhZCcpKTtcbiAgICB9ZWxzZSBpZih0eXBlID09ICduZXdzJyl7XG4gICAgICAgIGNoYW5uZWwuc2VjdGlvbnMucHVzaChnZW5lcmF0ZVNlY3Rpb24oJ2hlYWQnKSk7XG4gICAgICAgIGNoYW5uZWwuc2VjdGlvbnMucHVzaChnZW5lcmF0ZVNlY3Rpb24oJ3Bvc3QnKSk7XG4gICAgfVxuICAgIHJldHVybiBjaGFubmVsO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVNlY3Rpb24gKGNhdGVnb3J5LCBwYXJhbXMpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB2YXIgc2VjdGlvblBhcmFtcyA9IHNlY3Rpb25BdHRycyhjYXRlZ29yeSwgcGFyYW1zKTtcbiAgICB2YXIgc2VjdGlvbiA9IG5ld1NlY3Rpb24oc2VjdGlvblBhcmFtcyk7XG4gICAgaWYoc2VjdGlvblBhcmFtcy5zYW1wbGVEaXZpc2lvbil7XG4gICAgICAgIHZhciBkaXZpc2lvbiA9IHNlY3Rpb25QYXJhbXMuc2FtcGxlRGl2aXNpb24oKTtcbiAgICAgICAgc2V0QXR0cihkaXZpc2lvbiwgJ3NhbXBsZScsICd5ZXMnKTtcbiAgICAgICAgc2VjdGlvbi5kaXZpc2lvbnMucHVzaChkaXZpc2lvbik7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWN0aW9uUGFyYW1zLnNhbXBsZURpdmlzaW9uUmVwZWF0OyBpKyspe1xuICAgICAgICAgICAgc2VjdGlvbi5kaXZpc2lvbnMucHVzaChzZWN0aW9uUGFyYW1zLnNhbXBsZURpdmlzaW9uKCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWN0aW9uO1xufTtcblxuZnVuY3Rpb24gc2VjdGlvbkF0dHJzIChjYXRlZ29yeSwgcGFyYW1zKXtcbiAgICBpZihjYXRlZ29yeSA9PSAnaGVhZCcpe1xuICAgICAgICByZXR1cm4gaGVhZFNlY3Rpb25BdHRycygpO1xuICAgIH1lbHNlIGlmKGNhdGVnb3J5ID09ICd0aWNrZXRzJyl7XG4gICAgICAgIHJldHVybiB0aWNrZXRzU2VjdGlvbkF0dHJzKCk7XG4gICAgfWVsc2UgaWYoY2F0ZWdvcnkgPT0gJ2FnZW5kYScpe1xuICAgICAgICByZXR1cm4gYWdlbmRhU2VjdGlvbkF0dHJzKCk7XG4gICAgfWVsc2UgaWYoY2F0ZWdvcnkgPT0gJ3BlcnNvbnMnKXtcbiAgICAgICAgcmV0dXJuIHBlcnNvbnNTZWN0aW9uQXR0cnMoKTtcbiAgICB9ZWxzZSBpZihjYXRlZ29yeSA9PSAnb3JnYW5pemF0aW9ucycpe1xuICAgICAgICByZXR1cm4gb3JnYW5pemF0aW9uc1NlY3Rpb25BdHRycygpO1xuICAgIH1lbHNlIGlmKGNhdGVnb3J5ID09ICdwb3N0Jyl7XG4gICAgICAgIHJldHVybiBwb3N0U2VjdGlvbkF0dHJzKCk7XG4gICAgfWVsc2UgaWYoY2F0ZWdvcnkgPT0gJ25ld3MnKXtcbiAgICAgICAgcmV0dXJuIG5ld3NTZWN0aW9uQXR0cnMocGFyYW1zKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbn1cblxuIGZ1bmN0aW9uIGhlYWRTZWN0aW9uQXR0cnMoKXtcbiAgICByZXR1cm4gIHtcbiAgICAgICAgaGVhZCA6ICd5ZXMnLFxuICAgICAgICBzZWN0aW9uQ2F0ZWdvcnkgOiAnY2xpbmdoZWFkJyxcbiAgICAgICAgZGlzcGxheVRpdGxlIDogJ25vJyxcbiAgICAgICAgZGl2aXNpb25zIDogY2xpbmdEaXZpc2lvbnMoKSxcbiAgICAgICAgY3NzS2V5IDogJ2NsaW5naGVhZCdcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsaW5nRGl2aXNpb25zKCl7XG4gICAgdmFyIGRpdmlzaW9ucyA9IFtdO1xuICAgIHZhciBkaXZpc2lvbiA9IHtcbiAgICAgICAgYXR0cmlidXRlcyA6IFtdLFxuICAgICAgICBlbGVtZW50cyA6IFtdXG4gICAgfVxuICAgIGRpdmlzaW9uLmVsZW1lbnRzLnB1c2goXG4gICAgICAgIGltYWdlRWxlbWVudCh7YXNCYWNrZ3JvdW5kOid5ZXMnLCBoZWlnaHQ6JzE2MHB4Jywgd2lkdGg6JzEwMCUnfSlcbiAgICApXG4gICAgZGl2aXNpb24uZWxlbWVudHMucHVzaChcbiAgICAgICAgdGV4dEVsZW1lbnQoe1xuICAgICAgICAgICAgdmFsdWUgOiBcIuagh+mimOaWh+Wtl1wiLFxuICAgICAgICAgICAgdHlwZSA6IFwiaXRlbXRpdGxlXCJcbiAgICAgICAgfSlcbiAgICApO1xuICAgIGRpdmlzaW9uLmVsZW1lbnRzLnB1c2goXG4gICAgICAgIHRleHRFbGVtZW50KHtcbiAgICAgICAgICAgIHZhbHVlIDogXCLmj4/ov7DmloflrZdcIixcbiAgICAgICAgICAgIHR5cGUgOiBcImRlc2NyaXB0aW9uXCJcbiAgICAgICAgfSlcbiAgICApO1xuICAgIGRpdmlzaW9ucy5wdXNoKGRpdmlzaW9uKTtcbiAgICByZXR1cm4gZGl2aXNpb25zO1xufVxuXG5mdW5jdGlvbiBwb3N0U2VjdGlvbkF0dHJzKCl7XG4gICAgcmV0dXJuICB7XG4gICAgICAgIHRpdGxlIDogXCLmlrDpl7tcIixcbiAgICAgICAgc2VjdGlvbkNhdGVnb3J5IDogJ3Bvc3QnLFxuICAgICAgICBkaXZpc2lvbnMgOiBwb3N0RGl2aXNpb24oKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc3REaXZpc2lvbigpe1xuICAgICAgICB2YXIgZGl2aXNpb25zID0gW107XG4gICAgICAgIHZhciBkaXZpc2lvbiA9IHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMgOiBbXSxcbiAgICAgICAgICAgIGVsZW1lbnRzIDogW11cbiAgICAgICAgfVxuICAgICAgICBkaXZpc2lvbi5lbGVtZW50cy5wdXNoKFxuICAgICAgICAgICAgcmljaFRleHRFbGVtZW50KHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA6IFwi57yW6L6R5YaF5a65Li5cIlxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgICAgZGl2aXNpb25zLnB1c2goZGl2aXNpb24pO1xuICAgICAgICByZXR1cm4gZGl2aXNpb25zO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW1hZ2VFbGVtZW50KHBhcmFtcyl7XG4gICAgdmFyIHBhcmFtcyA9IHBhcmFtcyA/IHBhcmFtcyA6IHt9O1xuICAgIHZhciB2YWx1ZSA9IFwiaHR0cDovL3BsYWNlaG9sZC5pdC8yMDB4MjAwP3RleHQ9aW1hZ2VcIjtcbiAgICBwYXJhbXMuYXR0cmlidXRlcyA9IHBhcmFtcy5hdHRyaWJ1dGVzID8gcGFyYW1zLmF0dHJpYnV0ZXMgOiBbXTtcblxuICAgIGlmKHBhcmFtcy52YWx1ZSl7XG4gICAgICAgIHZhbHVlID0gcGFyYW1zLnZhbHVlO1xuICAgIH1cbiAgICB2YXIgYXR0cmlidXRlcyA9IFtcbiAgICAgICAgeyBrZXkgOiAndHlwZScsIHZhbHVlIDogcGFyYW1zLnR5cGUgPyBwYXJhbXMudHlwZSA6ICdpbWFnZScgfSxcbiAgICAgICAgeyBrZXkgOiAnbGlua1VybCcsIHZhbHVlIDogcGFyYW1zLmxpbmtVcmwgPyBwYXJhbXMubGlua1VybCA6ICcnIH0sXG4gICAgICAgIHsga2V5IDogJ2FsdFRleHQnLCB2YWx1ZSA6IHBhcmFtcy5hbHRUZXh0ID8gcGFyYW1zLmFsdFRleHQgOiAnJyB9LFxuICAgICAgICB7IGtleSA6ICdhc0JhY2tncm91bmQnLCB2YWx1ZSA6IHBhcmFtcy5hc0JhY2tncm91bmQgPyBwYXJhbXMuYXNCYWNrZ3JvdW5kIDogJycgfSxcbiAgICAgICAgeyBrZXkgOiAnd2lkdGgnLCB2YWx1ZSA6IHBhcmFtcy53aWR0aCA/IHBhcmFtcy53aWR0aCA6ICcnIH0sXG4gICAgICAgIHsga2V5IDogJ2hlaWdodCcsIHZhbHVlIDogcGFyYW1zLmhlaWdodCA/IHBhcmFtcy5oZWlnaHQgOiAnJyB9XG4gICAgXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGtleSA6ICcnLFxuICAgICAgICB2YWx1ZSA6IHZhbHVlLFxuICAgICAgICBhdHRyaWJ1dGVzOiBfLnVuaW9uKGF0dHJpYnV0ZXMsIHBhcmFtcy5hdHRyaWJ1dGVzKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdGV4dEVsZW1lbnQocGFyYW1zKXtcbiAgICB2YXIgcGFyYW1zID0gcGFyYW1zID8gcGFyYW1zIDoge307XG4gICAgcGFyYW1zLmF0dHJpYnV0ZXMgPSBwYXJhbXMuYXR0cmlidXRlcyA/IHBhcmFtcy5hdHRyaWJ1dGVzIDogW107XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5IDogXCJcIixcbiAgICAgICAgdmFsdWUgOiBwYXJhbXMudmFsdWUgPyBwYXJhbXMudmFsdWUgOiBcInRleHRcIixcbiAgICAgICAgYXR0cmlidXRlcyA6IF8udW5pb24oW3tcbiAgICAgICAgICAgIGtleSA6IFwidHlwZVwiLFxuICAgICAgICAgICAgdmFsdWUgOiBwYXJhbXMudHlwZSA/IHBhcmFtcy50eXBlIDogJ3RleHQnXG4gICAgICAgIH1dLCBwYXJhbXMuYXR0cmlidXRlcylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJpY2hUZXh0RWxlbWVudChwYXJhbXMpe1xuICAgIHZhciBwYXJhbXMgPSBwYXJhbXMgPyBwYXJhbXMgOiB7fTtcbiAgICBwYXJhbXMuYXR0cmlidXRlcyA9IHBhcmFtcy5hdHRyaWJ1dGVzID8gcGFyYW1zLmF0dHJpYnV0ZXMgOiBbXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGtleSA6ICcnLFxuICAgICAgICB2YWx1ZSA6IHBhcmFtcy52YWx1ZSA/IHBhcmFtcy52YWx1ZSA6ICd0ZXh0JyxcbiAgICAgICAgYXR0cmlidXRlczogXy51bmlvbihbe1xuICAgICAgICAgICAga2V5IDogJ3R5cGUnLFxuICAgICAgICAgICAgdmFsdWUgOiAncmljaHRleHQnXG4gICAgICAgIH1dLCBwYXJhbXMuYXR0cmlidXRlcylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5ld1NlY3Rpb24ocGFyYW1zKXtcbiAgICB2YXIgcGFyYW1zID0gcGFyYW1zID8gcGFyYW1zIDoge307XG4gICAgdmFyIHNlY3Rpb24gPSB7XG4gICAgICAgIGF0dHJpYnV0ZXMgOiBbXG4gICAgICAgIHsgXG4gICAgICAgICAgICBrZXkgOiBcImhlYWRcIiwgXG4gICAgICAgICAgICB2YWx1ZSA6IHBhcmFtcy5oZWFkID8gcGFyYW1zLmhlYWQgOiBcIm5vXCJcbiAgICAgICAgfSxcbiAgICAgICAgeyBcbiAgICAgICAgICAgIGtleSA6IFwic2VjdGlvbkNhdGVnb3J5XCIsIFxuICAgICAgICAgICAgdmFsdWUgOiBwYXJhbXMuc2VjdGlvbkNhdGVnb3J5ID8gcGFyYW1zLnNlY3Rpb25DYXRlZ29yeSA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgeyBcbiAgICAgICAgICAgIGtleSA6IFwidGl0bGVcIiwgXG4gICAgICAgICAgICB2YWx1ZSA6IHBhcmFtcy50aXRsZSA/IHBhcmFtcy50aXRsZSA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgeyBcbiAgICAgICAgICAgIGtleSA6IFwic2VxdWVuY2VcIiwgXG4gICAgICAgICAgICB2YWx1ZSA6IHBhcmFtcy5zZXF1ZW5jZSA/IHBhcmFtcy5zZXF1ZW5jZSA6IFwiMlwiXG4gICAgICAgIH0sXG4gICAgICAgIHsgXG4gICAgICAgICAgICBrZXkgOiBcImRpc3BsYXlUaXRsZVwiLCBcbiAgICAgICAgICAgIHZhbHVlIDogcGFyYW1zLmRpc3BsYXlUaXRsZSA/IHBhcmFtcy5kaXNwbGF5VGl0bGUgOiBcInllc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGtleSA6IFwid2lkdGhcIiwgXG4gICAgICAgICAgICB2YWx1ZSA6IHBhcmFtcy53aWR0aCA/IHBhcmFtcy53aWR0aCA6IFwiMTAwMFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGtleSA6IFwidGV4dEFsaWduXCIsIFxuICAgICAgICAgICAgdmFsdWUgOiBwYXJhbXMudGV4dEFsaWduID8gcGFyYW1zLnRleHRBbGlnbiA6IFwiY2VudGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAga2V5IDogXCJjYXJvdXNlbFwiLFxuICAgICAgICAgICAgdmFsdWUgOiBwYXJhbXMuY2Fyb3VzZWwgPyBwYXJhbXMuY2Fyb3VzZWwgOiBcIlwiXG4gICAgICAgIH0se1xuICAgICAgICAgICAga2V5IDogXCJjc3NLZXlcIiwgXG4gICAgICAgICAgICB2YWx1ZSA6IHBhcmFtcy5jc3NLZXkgPyBwYXJhbXMuY3NzS2V5IDogXCJcIlxuICAgICAgICB9LHtcbiAgICAgICAgICAgIGtleSA6IFwiZXZlbnRTeW5jS2V5XCIsIFxuICAgICAgICAgICAgdmFsdWUgOiBwYXJhbXMuZXZlbnRTeW5jS2V5ID8gcGFyYW1zLmV2ZW50U3luY0tleSA6IFwiXCJcbiAgICAgICAgfSx7XG4gICAgICAgICAgICBrZXkgOiBcImNvbnRlbnRTeW5jXCIsIFxuICAgICAgICAgICAgdmFsdWUgOiBwYXJhbXMuY29udGVudFN5bmMgPyBwYXJhbXMuY29udGVudFN5bmMgOiBcIlwiXG4gICAgICAgIH0se1xuICAgICAgICAgICAga2V5IDogXCJzeW5jVHlwZVwiLCBcbiAgICAgICAgICAgIHZhbHVlIDogcGFyYW1zLnN5bmNUeXBlID8gcGFyYW1zLnN5bmNUeXBlIDogXCJcIlxuICAgICAgICB9LHtcbiAgICAgICAgICAgIGtleSA6IFwic3luY1NldEtleVwiLCBcbiAgICAgICAgICAgIHZhbHVlIDogcGFyYW1zLnN5bmNTZXRLZXkgPyBwYXJhbXMuc3luY1NldEtleSA6IFwiXCJcbiAgICAgICAgfSx7XG4gICAgICAgICAgICBrZXkgOiBcInN5bmNTZXRWYWx1ZVwiLCBcbiAgICAgICAgICAgIHZhbHVlIDogcGFyYW1zLnN5bmNTZXRWYWx1ZSA/IHBhcmFtcy5zeW5jU2V0VmFsdWUgOiBcIlwiXG4gICAgICAgIH0se1xuICAgICAgICAgICAga2V5IDogXCJsaW5rVXJsXCIsIFxuICAgICAgICAgICAgdmFsdWUgOiBwYXJhbXMubGlua1VybCA/IHBhcmFtcy5saW5rVXJsIDogXCJcIiBcbiAgICAgICAgfV0sXG4gICAgICAgIGRpdmlzaW9ucyA6IHBhcmFtcy5kaXZpc2lvbnMgPyBwYXJhbXMuZGl2aXNpb25zIDogW11cbiAgICB9XG4gICAgcmV0dXJuIHNlY3Rpb247XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlQ2hhbm5lbCA6IGdlbmVyYXRlQ2hhbm5lbCxcbiAgICBnZW5lcmF0ZVNlY3Rpb24gOiBnZW5lcmF0ZVNlY3Rpb24sXG4gICAgaXNJbWFnZUVsZW1lbnQgOiBpc0ltYWdlRWxlbWVudCxcbiAgICBpc1RleHRFbGVtZW50IDogaXNUZXh0RWxlbWVudCxcbiAgICBpc0h0bWxFbGVtZW50IDogaXNIdG1sRWxlbWVudCxcbiAgICBpc1BlcnNvbkVsZW1lbnQgOiBpc1BlcnNvbkVsZW1lbnRcbn0iLCJmdW5jdGlvbiBnZXRTZWN0aW9uKHNlY3Rpb25JZCwgY2FsbGJhY2spIHtcblx0dmFyIHVybCA9IGZsYW1pbmdvUm9vdCArICcvZmxhbWluZ28tYXBpL2NoYW5uZWwvc2VjdGlvbi8nICsgc2VjdGlvbklkO1xuXHQkLmdldEpTT04odXJsLCB7fSwgY2FsbGJhY2ssIGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gYWRkU2VjdGlvbihzZWN0aW9uLCBjaGFubmVsSWQsIGNhbGxiYWNrKXtcblx0dmFyIHVybCA9IGZsYW1pbmdvUm9vdCArICcvZmxhbWluZ28tYXBpL2NoYW5uZWwvJyArIGNoYW5uZWxJZCArICcvc2VjdGlvbi9hZGQnO1xuICAgIHBvc3QodXJsLCBzZWN0aW9uLCBjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIGdldENoYW5uZWxzSGVhZChpbmRleEtleSwgaW5kZXhWYWx1ZSwgY2FsbGJhY2spe1xuXHR2YXIgdXJsID0gZmxhbWluZ29Sb290ICsgJy9mbGFtaW5nby1hcGkvY2hhbm5lbC9zZXQvY2hhbm5lbHNIZWFkJztcblx0dmFyIHBhcmFtcyA9IHtcblx0XHRpbmRleEtleSA6IGluZGV4S2V5LFxuICAgICAgICBpbmRleFZhbHVlIDogaW5kZXhWYWx1ZVxuXHR9XG5cdCQuZ2V0SlNPTih1cmwsIHBhcmFtcywgY2FsbGJhY2ssIGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2hhbm5lbChjaGFubmVsSWQsIGNhbGxiYWNrKXtcblx0dmFyIHVybCA9IGZsYW1pbmdvUm9vdCArICcvZmxhbWluZ28tYXBpL2NoYW5uZWwvJyArIGNoYW5uZWxJZDtcblx0JC5nZXRKU09OKHVybCwge30sIGNhbGxiYWNrLCBjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIGdldFNlY3Rpb25zQXR0cmlidXRlcyhpbmRleEtleSwgaW5kZXhWYWx1ZSwgY2FsbGJhY2spe1xuXHR2YXIgcGFyYW1zID0ge1xuXHRcdGluZGV4S2V5IDogaW5kZXhLZXksXG4gICAgICAgIGluZGV4VmFsdWUgOiBpbmRleFZhbHVlXG5cdH1cblx0dmFyIHVybCA9IGZsYW1pbmdvUm9vdCArICcvZmxhbWluZ28tYXBpL3NldC9zZWN0aW9ucy9hdHRyaWJ1dGVzJztcblx0JC5nZXRKU09OKHVybCwgcGFyYW1zLCBjYWxsYmFjaywgY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiBhZGRDaGFubmVsKGluZGV4S2V5LCBpbmRleFZhbHVlLCBjaGFubmVsLCBjYWxsYmFjaykge1xuXHR2YXIgdXJsID0gZmxhbWluZ29Sb290ICsgJy9mbGFtaW5nby1hcGkvY2hhbm5lbC9zZXQvYWRkQ2hhbm5lbCcgKyAnP2luZGV4S2V5PScgKyBpbmRleEtleSArICcmaW5kZXhWYWx1ZT0nICsgaW5kZXhWYWx1ZTtcbiAgICBwb3N0KHVybCwgY2hhbm5lbCwgY2FsbGJhY2spO1xufTtcblxuZnVuY3Rpb24gdXBkYXRlRWxlbWVudCAoZWxlbWVudCwgY2FsbGJhY2spe1xuXHR2YXIgdXJsID0gZmxhbWluZ29Sb290ICsgJy9mbGFtaW5nby1hcGkvY2hhbm5lbC9lbGVtZW50L3VwZGF0ZS8nICsgIGVsZW1lbnQuZWxlbWVudElkO1xuXHRwb3N0KHVybCwge1xuICAgICAgICBrZXkgOiBlbGVtZW50LmtleSxcbiAgICAgICAgdmFsdWUgOiBlbGVtZW50LnZhbHVlXG4gICAgfSwgY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBdHRyKGVsZW1lbnRUeXBlLCBlbGVtZW50LCBrZXksIHZhbHVlKXtcbiAgICB1cGRhdGVFbGVtZW50QXR0cihlbGVtZW50LCBrZXksIHZhbHVlKTtcbiAgICByZXR1cm4gdXBkYXRlQXR0ckFwaShlbGVtZW50VHlwZSwgZWxlbWVudCwga2V5LCB2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNoYW5uZWxBdHRyIChjaGFubmVsSWQsIGtleSwgdmFsdWUsIGNhbGxiYWNrKXtcblx0dmFyIHVybCA9IGZsYW1pbmdvUm9vdCArICcvZmxhbWluZ28tYXBpL2NoYW5uZWwvJyArIGNoYW5uZWxJZCArICcvYXR0clVwZGF0ZSc7XG4gICAgcG9zdCh1cmwsIHtcbiAgICAgICAga2V5IDoga2V5LFxuICAgICAgICB2YWx1ZSA6IHZhbHVlXG4gICAgfSwgY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoKGh0bWwsIHBhdGgsIGNhbGxiYWNrKXtcblx0dmFyIHVybCA9IGZsYW1pbmdvUm9vdCArICcvZmxhbWluZ28tYXBpL3B1Ymxpc2gvdjEnO1xuXHRwb3N0KHVybCwge1xuXHRcdHBhdGggOiBwYXRoLFxuXHRcdGh0bWwgOiBodG1sXG5cdH0sIGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gcG9zdCh1cmwsIGRhdGEsIGNhbGxiYWNrKXtcblx0JC5hamF4KHtcblx0ICAgIHR5cGU6IFwiUE9TVFwiLFxuXHQgICAgdXJsOiB1cmwsXG5cdCAgICAvLyBUaGUga2V5IG5lZWRzIHRvIG1hdGNoIHlvdXIgbWV0aG9kJ3MgaW5wdXQgcGFyYW1ldGVyIChjYXNlLXNlbnNpdGl2ZSkuXG5cdCAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcblx0ICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcblx0ICAgIGRhdGFUeXBlOiBcImpzb25cIixcblx0ICAgIHN1Y2Nlc3M6IGNhbGxiYWNrLFxuXHQgICAgZmFpbHVyZTogZnVuY3Rpb24oZXJyTXNnKSB7XG5cdCAgICAgICAgY2FsbGJhY2soZXJyTXNnKTtcblx0ICAgIH1cblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRnZXRDaGFubmVsIDogZ2V0Q2hhbm5lbCxcbiAgICBnZXRTZWN0aW9uIDogZ2V0U2VjdGlvbixcbiAgICBnZXRDaGFubmVsc0hlYWQgOiBnZXRDaGFubmVsc0hlYWQsXG4gICAgZ2V0U2VjdGlvbnNBdHRyaWJ1dGVzIDogZ2V0U2VjdGlvbnNBdHRyaWJ1dGVzLFxuICAgIGFkZENoYW5uZWwgOiBhZGRDaGFubmVsLFxuICAgIGFkZFNlY3Rpb24gOiBhZGRTZWN0aW9uLFxuICAgIHVwZGF0ZUVsZW1lbnQgOiB1cGRhdGVFbGVtZW50LFxuICAgIHVwZGF0ZUNoYW5uZWxBdHRyIDogdXBkYXRlQ2hhbm5lbEF0dHIsXG4gICAgcHVibGlzaCA6IHB1Ymxpc2hcbn0iLCJ2YXIgY2hhbm5lbFNlcnZpY2UgPSByZXF1aXJlKCcuL2NoYW5uZWxTZXJ2aWNlJyk7XG52YXIgY2hhbm5lbE1vZGVsU2VydmljZSA9IHJlcXVpcmUoJy4vY2hhbm5lbE1vZGVsU2VydmljZScpO1xuXG5mdW5jdGlvbiBzeW5jU2VjdGlvbihzZWN0aW9uLCBsaW1pdCwgY2FsbGJhY2spe1xuICAgIHNlY3Rpb24uZGl2aXNpb25zID0gW107XG4gICAgaWYoZ2V0QXR0cihzZWN0aW9uLCAnc3luY1R5cGUnKSA9PSAnc2V0SGVhZHMnKXtcbiAgICAgICAgdmFyIHN5bmNTZXRLZXkgPSBnZXRBdHRyKHNlY3Rpb24sICdzeW5jU2V0S2V5Jyk7XG4gICAgICAgIHZhciBzeW5jU2V0VmFsdWUgPSBnZXRBdHRyKHNlY3Rpb24sICdzeW5jU2V0VmFsdWUnKTtcbiAgICAgICAgY2hhbm5lbFNlcnZpY2UuZ2V0Q2hhbm5lbHNIZWFkKHN5bmNTZXRLZXksIHN5bmNTZXRWYWx1ZSwgZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIGlmKHJlcy5kYXRhKXtcbiAgICAgICAgICAgICAgICB2YXIgc2VjdGlvbnMgPSByZWZpbmUocmVzLmRhdGEsIGxpbWl0KTtcbiAgICAgICAgICAgICAgICBfLmVhY2goc2VjdGlvbnMsIGZ1bmN0aW9uKGhlYWQpe1xuICAgICAgICAgICAgICAgICAgICBpZihoZWFkLmRpdmlzaW9uc1swXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGl2aXNpb24gPSBoZWFkLmRpdmlzaW9uc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uLmxpbmtJZCA9IGhlYWQuY2hhbm5lbElkOyAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VjdGlvbi5kaXZpc2lvbnMucHVzaChkaXZpc2lvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsbGJhY2soc2VjdGlvbik7XG4gICAgICAgIH0pXG4gICAgfWVsc2V7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzeW5jU2V0U2VjdGlvbihwYXJhbXMsIGNhbGxiYWNrKXtcbiAgICB2YXIgc3luY1NldEtleSA9IHBhcmFtcy5zZXRLZXk7XG4gICAgdmFyIHN5bmNTZXRWYWx1ZSA9IHBhcmFtcy5zZXRWYWx1ZTtcbiAgICB2YXIgc2VjdGlvbiA9IGNoYW5uZWxNb2RlbFNlcnZpY2UuZ2VuZXJhdGVTZWN0aW9uKCk7XG5cbiAgICBjaGFubmVsU2VydmljZS5nZXRDaGFubmVsc0hlYWQoc3luY1NldEtleSwgc3luY1NldFZhbHVlLCBmdW5jdGlvbihyZXMpe1xuICAgICAgICBpZihyZXMuZGF0YSl7XG4gICAgICAgICAgICB2YXIgc2VjdGlvbnMgPSByZWZpbmUocmVzLmRhdGEsIHBhcmFtcy5saW1pdCk7XG4gICAgICAgICAgICBfLmVhY2goc2VjdGlvbnMsIGZ1bmN0aW9uKGhlYWQpe1xuICAgICAgICAgICAgICAgIGlmKGhlYWQuZGl2aXNpb25zWzBdKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpdmlzaW9uID0gaGVhZC5kaXZpc2lvbnNbMF07XG4gICAgICAgICAgICAgICAgICAgIGRpdmlzaW9uLmxpbmtJZCA9IGhlYWQuY2hhbm5lbElkOyAgIFxuICAgICAgICAgICAgICAgICAgICBzZWN0aW9uLmRpdmlzaW9ucy5wdXNoKGRpdmlzaW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKHNlY3Rpb24pO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGdldEF0dHIoZWxlbWVudCwga2V5KXtcbiAgICB2YXIgYXR0ciA9IF8uZmluZChlbGVtZW50LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpe1xuICAgICAgICByZXR1cm4gYXR0ci5rZXkgPT0ga2V5O1xuICAgIH0pXG4gICAgaWYoYXR0cil7XG4gICAgICAgIHJldHVybiBhdHRyLnZhbHVlO1xuICAgIH1lbHNle1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlZmluZShzZWN0aW9ucywgbGltaXQpe1xuICAgIHNlY3Rpb25zID0gXy5zb3J0Qnkoc2VjdGlvbnMsIGZ1bmN0aW9uKHNlY3Rpb24pe3JldHVybiAtc2VjdGlvbi5jaGFubmVsSWR9KTtcbiAgICBpZihsaW1pdCl7XG4gICAgICAgIHNlY3Rpb25zID0gc2VjdGlvbnMuc3BsaWNlKDAsIGxpbWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHNlY3Rpb25zO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzeW5jU2VjdGlvbiA6IHN5bmNTZWN0aW9uLFxuICAgIHN5bmNTZXRTZWN0aW9uIDogc3luY1NldFNlY3Rpb25cbn0iLCJmdW5jdGlvbiBzYXZlSXRlbSAoa2V5LCBpdGVtKXtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGl0ZW0pKTtcbn1cblxuZnVuY3Rpb24gZ2V0SXRlbSAoa2V5KXtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpIHx8IFwie31cIik7XG59XG5cbmZ1bmN0aW9uIGluaXRVcGxvYWQgKGNvbmZpZywgZXJyb3IpIHtcbiAgICBnZXRRaW5pdVVwbG9hZFRva2VuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKHJlcy5zdGF0dXMgPT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlnLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIF8uZWFjaChjb25maWcsIGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICAgICAgICAgIGluaXRRaW5pdVVwbG9hZChyZXMuZGF0YSwganNvbi5idG4sIGpzb24uY29udGFpbmVyLCBqc29uLmRyb3B6b25lLCBqc29uLnByb2dyZXNzLCBqc29uLnN1Y2Nlc3MsIGpzb24uZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwbG9hZCBjb21wb25lbnQgaW5pdCBzdWNjZXNzLi4uJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICBlcnJvcihyZXMubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwbG9hZCBjb21wb25lbnQgaW5pdCBmYWlsZWQuLi4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gZ2V0UWluaXVVcGxvYWRUb2tlbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgdXJsID0gZmxhbWluZ29Sb290ICsgJy9mbGFtaW5nby1hcGkvcWluaXUvdXB0b2tlbi8nO1xuICAgICQuZ2V0SlNPTih1cmwsIHt3aXRoQ3JlZGVudGlhbHM6IHRydWV9LCBjYWxsYmFjaywgY2FsbGJhY2spO1xufTtcblxuZnVuY3Rpb24gaW5pdFFpbml1VXBsb2FkKHRva2VuLCBidG4sIGNvbnRhaW5lciwgZHJvcHpvbmUsIHByb2dyZXNzLCBzdWNjZXNzLCBlcnJvcikge1xuICAgIHZhciB1cGxvYWRlciA9IFFpbml1LnVwbG9hZGVyKHtcbiAgICAgICAgcnVudGltZXM6ICdodG1sNSxmbGFzaCxodG1sNCcsICAgIC8v5LiK5Lyg5qih5byPLOS+neasoemAgOWMllxuICAgICAgICBicm93c2VfYnV0dG9uOiBidG4sICAgICAgIC8v5LiK5Lyg6YCJ5oup55qE54K56YCJ5oyJ6ZKu77yMKirlv4XpnIAqKlxuICAgICAgICAvLyBkb3dudG9rZW5fdXJsOiAnL2Rvd250b2tlbicsXG4gICAgICAgIC8vIEFqYXjor7fmsYJkb3duVG9rZW7nmoRVcmzvvIznp4HmnInnqbrpl7Tml7bkvb/nlKgsSlMtU0RL5bCG5ZCR6K+l5Zyw5Z2AUE9TVOaWh+S7tueahGtleeWSjGRvbWFpbizmnI3liqHnq6/ov5Tlm57nmoRKU09O5b+F6aG75YyF5ZCrYHVybGDlrZfmrrXvvIxgdXJsYOWAvOS4uuivpeaWh+S7tueahOS4i+i9veWcsOWdgFxuICAgICAgICB1cHRva2VuOiB0b2tlbiwgLy/oi6XmnKrmjIflrpp1cHRva2VuX3VybCzliJnlv4XpobvmjIflrpogdXB0b2tlbiAsdXB0b2tlbueUseWFtuS7lueoi+W6j+eUn+aIkFxuICAgICAgICB1bmlxdWVfbmFtZXM6IHRydWUsIC8vIOm7mOiupCBmYWxzZe+8jGtleeS4uuaWh+S7tuWQjeOAguiLpeW8gOWQr+ivpemAiemhue+8jFNES+S8muS4uuavj+S4quaWh+S7tuiHquWKqOeUn+aIkGtlee+8iOaWh+S7tuWQje+8iVxuICAgICAgICAvLyBzYXZlX2tleTogdHJ1ZSwgICAvLyDpu5jorqQgZmFsc2XjgILoi6XlnKjmnI3liqHnq6/nlJ/miJB1cHRva2Vu55qE5LiK5Lyg562W55Wl5Lit5oyH5a6a5LqGIGBzYXZhX2tleWDvvIzliJnlvIDlkK/vvIxTREvlnKjliY3nq6/lsIbkuI3lr7lrZXnov5vooYzku7vkvZXlpITnkIZcbiAgICAgICAgZG9tYWluOiAnaHR0cDovL2VsYnVja2V0LnFpbml1ZG4uY29tLycsICAgLy9idWNrZXQg5Z+f5ZCN77yM5LiL6L296LWE5rqQ5pe255So5Yiw77yMKirlv4XpnIAqKlxuICAgICAgICBjb250YWluZXI6IGNvbnRhaW5lciwgICAgICAgICAgIC8v5LiK5Lyg5Yy65Z+fRE9NIElE77yM6buY6K6k5pivYnJvd3Nlcl9idXR0b27nmoTniLblhYPntKDvvIxcbiAgICAgICAgbWF4X2ZpbGVfc2l6ZTogJzEwMG1iJywgICAgICAgICAgIC8v5pyA5aSn5paH5Lu25L2T56ev6ZmQ5Yi2XG4gICAgICAgIGZsYXNoX3N3Zl91cmw6ICdsaWIvcGx1cGxvYWQvTW94aWUuc3dmJywgIC8v5byV5YWlZmxhc2gs55u45a+56Lev5b6EXG4gICAgICAgIG1heF9yZXRyaWVzOiAzLCAgICAgICAgICAgICAgICAgICAvL+S4iuS8oOWksei0peacgOWkp+mHjeivleasoeaVsFxuICAgICAgICBkcmFnZHJvcDogdHJ1ZSwgICAgICAgICAgICAgICAgICAgLy/lvIDlkK/lj6/mi5bmm7PkuIrkvKBcbiAgICAgICAgZHJvcF9lbGVtZW50OiBkcm9wem9uZSwgICAgICAgIC8v5ouW5puz5LiK5Lyg5Yy65Z+f5YWD57Sg55qESUTvvIzmi5bmm7Pmlofku7bmiJbmlofku7blpLnlkI7lj6/op6blj5HkuIrkvKBcbiAgICAgICAgY2h1bmtfc2l6ZTogJzRtYicsICAgICAgICAgICAgICAgIC8v5YiG5Z2X5LiK5Lyg5pe277yM5q+P54mH55qE5L2T56evXG4gICAgICAgIGF1dG9fc3RhcnQ6IHRydWUsICAgICAgICAgICAgICAgICAvL+mAieaLqeaWh+S7tuWQjuiHquWKqOS4iuS8oO+8jOiLpeWFs+mXremcgOimgeiHquW3see7keWumuS6i+S7tuinpuWPkeS4iuS8oCxcbiAgICAgICAgLy94X3ZhbHMgOiB7XG4gICAgICAgIC8vICAgIOiHquWumuS5ieWPmOmHj++8jOWPguiAg2h0dHA6Ly9kZXZlbG9wZXIucWluaXUuY29tL2RvY3MvdjYvYXBpL292ZXJ2aWV3L3VwL3Jlc3BvbnNlL3ZhcnMuaHRtbFxuICAgICAgICAvLyAgICAndGltZScgOiBmdW5jdGlvbih1cCxmaWxlKSB7XG4gICAgICAgIC8vICAgICAgICB2YXIgdGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgICAgIC8vIGRvIHNvbWV0aGluZyB3aXRoICd0aW1lJ1xuICAgICAgICAvLyAgICAgICAgcmV0dXJuIHRpbWU7XG4gICAgICAgIC8vICAgIH0sXG4gICAgICAgIC8vICAgICdzaXplJyA6IGZ1bmN0aW9uKHVwLGZpbGUpIHtcbiAgICAgICAgLy8gICAgICAgIHZhciBzaXplID0gZmlsZS5zaXplO1xuICAgICAgICAvLyBkbyBzb21ldGhpbmcgd2l0aCAnc2l6ZSdcbiAgICAgICAgLy8gICAgICAgIHJldHVybiBzaXplO1xuICAgICAgICAvLyAgICB9XG4gICAgICAgIC8vfSxcbiAgICAgICAgaW5pdDoge1xuICAgICAgICAgICAgJ0ZpbGVzQWRkZWQnOiBmdW5jdGlvbiAodXAsIGZpbGVzKSB7XG4gICAgICAgICAgICAgICAgcGx1cGxvYWQuZWFjaChmaWxlcywgZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5paH5Lu25re75Yqg6L+b6Zif5YiX5ZCOLOWkhOeQhuebuOWFs+eahOS6i+aDhVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coMSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdCZWZvcmVVcGxvYWQnOiBmdW5jdGlvbiAodXAsIGZpbGUpIHtcbiAgICAgICAgICAgICAgICAvLyDmr4/kuKrmlofku7bkuIrkvKDliY0s5aSE55CG55u45YWz55qE5LqL5oOFXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdVcGxvYWRQcm9ncmVzcyc6IGZ1bmN0aW9uICh1cCwgZmlsZSkge1xuICAgICAgICAgICAgICAgIC8vIOavj+S4quaWh+S7tuS4iuS8oOaXtizlpITnkIbnm7jlhbPnmoTkuovmg4Vcbi8vICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZmlsZSk7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3MoZmlsZS5wZXJjZW50KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnRmlsZVVwbG9hZGVkJzogZnVuY3Rpb24gKHVwLCBmaWxlLCBpbmZvKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKDQpO1xuICAgICAgICAgICAgICAgIC8vIOavj+S4quaWh+S7tuS4iuS8oOaIkOWKn+WQjizlpITnkIbnm7jlhbPnmoTkuovmg4VcbiAgICAgICAgICAgICAgICAvLyDlhbbkuK0gaW5mbyDmmK/mlofku7bkuIrkvKDmiJDlip/lkI7vvIzmnI3liqHnq6/ov5Tlm57nmoRqc29u77yM5b2i5byP5aaCXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgIFwiaGFzaFwiOiBcIkZoOHhWcW9kMk1RMW1vY2ZJNFM0S3BSTDZEOThcIixcbiAgICAgICAgICAgICAgICAvLyAgICBcImtleVwiOiBcImdvZ29waGVyLmpwZ1wiXG4gICAgICAgICAgICAgICAgLy8gIH1cbiAgICAgICAgICAgICAgICAvLyDlj4LogINodHRwOi8vZGV2ZWxvcGVyLnFpbml1LmNvbS9kb2NzL3Y2L2FwaS9vdmVydmlldy91cC9yZXNwb25zZS9zaW1wbGUtcmVzcG9uc2UuaHRtbFxuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVwKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZmlsZSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZm8pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRvbWFpbiA9IHVwLmdldE9wdGlvbignZG9tYWluJyk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UoaW5mbyk7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZUxpbmsgPSBkb21haW4gKyByZXMua2V5OyAvL+iOt+WPluS4iuS8oOaIkOWKn+WQjueahOaWh+S7tueahFVybFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3Moc291cmNlTGluayk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc291cmNlTGluayk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ0Vycm9yJzogZnVuY3Rpb24gKHVwLCBlcnIsIGVyclRpcCkge1xuICAgICAgICAgICAgICAgIC8v5LiK5Lyg5Ye66ZSZ5pe2LOWkhOeQhuebuOWFs+eahOS6i+aDhVxuLy8gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyg1KTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXApO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyclRpcCk7XG4gICAgICAgICAgICAgICAgZXJyb3IoZXJyVGlwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnVXBsb2FkQ29tcGxldGUnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy/pmJ/liJfmlofku7blpITnkIblrozmr5XlkI4s5aSE55CG55u45YWz55qE5LqL5oOFXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKDYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdLZXknOiBmdW5jdGlvbiAodXAsIGZpbGUpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coNyk7XG4gICAgICAgICAgICAgICAgLy8g6Iul5oOz5Zyo5YmN56uv5a+55q+P5Liq5paH5Lu255qEa2V56L+b6KGM5Liq5oCn5YyW5aSE55CG77yM5Y+v5Lul6YWN572u6K+l5Ye95pWwXG4gICAgICAgICAgICAgICAgLy8g6K+l6YWN572u5b+F6aG76KaB5ZyoIHVuaXF1ZV9uYW1lczogZmFsc2UgLCBzYXZlX2tleTogZmFsc2Ug5pe25omN55Sf5pWIXG5cbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgd2l0aCBrZXkgaGVyZVxuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbi8vICAgICAgICAgICAgY29uc29sZS5sb2codXBsb2FkZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzYXZlSXRlbSA6IHNhdmVJdGVtLFxuICAgIGdldEl0ZW0gOiBnZXRJdGVtLFxuICAgIGluaXRVcGxvYWQgOiBpbml0VXBsb2FkXG59IiwiXG5yZXF1aXJlKCcuLi9saWIvZWpzJyk7XG52YXIgX3RlbXBsYXRlcyA9IHt9O1xuXG5cbiAgICBfdGVtcGxhdGVzLmltYWdlRWxlbWVudEVkaXQgPSB7XCJjb250ZW50XCI6XCI8ZGl2IGNsYXNzPVxcXCJwb3B1cC1lZGl0LXBhbmVsXFxcIj4gICAgPGRpdiBjbGFzcz1cXFwiaW1hZ2Utc2FtcGxlXFxcIiBpZD1cXFwiaW1hZ2Utc2FtcGxlLWNvbnRhaW5lclxcXCI+ICAgICAgICA8aW1nIHN0eWxlPVxcXCJtYXgtd2lkdGg6MjQwcHg7bWFyZ2luOiAxMHB4IGF1dG87IGRpc3BsYXk6YmxvY2s7XFxcIiBzcmM9XFxcIjwlPXZhbHVlJT5cXFwiPiAgICA8L2Rpdj4gICAgPHAgY2xhc3M9XFxcIm9wdC1idG4gdXBsb2FkXFxcIiBpZD1cXFwiaW1hZ2UtdXBsb2FkLWJ0blxcXCI+JiN4NjcyQzsmI3g1NzMwOyYjeDRFMEE7JiN4NEYyMDs8L3A+ICAgIDxocj4gICAgPHA+JiN4NTZGRTsmI3g3MjQ3OyYjeDU3MzA7JiN4NTc0MDs8L3A+ICAgICAgIDxkaXYgY2xhc3M9XFxcImlucHV0LWdyb3VwXFxcIj4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiB2YWx1ZT1cXFwiPCU9dmFsdWUlPlxcXCI+ICAgICAgICA8c3BhbiBjbGFzcz1cXFwic2F2ZSBpbnB1dC1ncm91cC1hZGRvblxcXCI+JiN4NEZERDsmI3g1QjU4Ozwvc3Bhbj4gICAgPC9kaXY+PC9kaXY+XCJ9O1xuXG5cbiAgICBfdGVtcGxhdGVzLnJpY2h0ZXh0RWxlbWVudEVkaXQgPSB7XCJjb250ZW50XCI6XCI8ZGl2IGNsYXNzPVxcXCJwb3B1cC1lZGl0LXBhbmVsXFxcIj48c2NyaXB0IGlkPVxcXCJ1ZS1jb250YWluZXJcXFwiIG5hbWU9XFxcImNvbnRlbnRcXFwiIHR5cGU9XFxcInRleHQvcGxhaW5cXFwiPjwlPXZhbHVlJT48L3NjcmlwdD48cCBjbGFzcz1cXFwib3B0LWJ0biBzYXZlXFxcIj4mI3g0RkREOyYjeDVCNTg7PC9wPjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+LmVkdWktZWRpdG9yLWlmcmFtZWhvbGRlcnttaW4taGVpZ2h0OiAzNTBweDt9PC9zdHlsZT48L2Rpdj5cIn07XG5cblxuICAgIF90ZW1wbGF0ZXMudGV4dEVkaXRNb2RhbCA9IHtcImNvbnRlbnRcIjpcIjxkaXYgY2xhc3M9XFxcInBvcHVwLWVkaXQtcGFuZWxcXFwiPjxwPiYjeDdGMTY7JiN4OEY5MTsmI3g2NTg3OyYjeDY3MkM7PC9wPjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwidGV4dC1pbnB1dFxcXCIgdmFsdWU9XFxcIjwlPXRleHQlPlxcXCIgc3R5bGU9XFxcIndpZHRoOjEwMCU7XFxcIj48cCBjbGFzcz1cXFwic2F2ZSBvcHQtYnRuXFxcIj4mI3g0RkREOyYjeDVCNTg7PC9wPjwvZGl2PlwifTtcblxuXG4gICAgX3RlbXBsYXRlcy50ZXh0RWxlbWVudEVkaXQgPSB7XCJjb250ZW50XCI6XCI8ZGl2IGNsYXNzPVxcXCJwb3B1cC1lZGl0LXBhbmVsXFxcIj48cD4mI3g3RjE2OyYjeDhGOTE7JiN4NjU4NzsmI3g2NzJDOzwvcD48dGV4dGFyZWEgY2xhc3M9XFxcImVsZW1lbnQtdmFsdWVcXFwiIHJvd3M9XFxcIjVcXFwiIHN0eWxlPVxcXCJ3aWR0aDoxMDAlO1xcXCI+PC90ZXh0YXJlYT48cCBjbGFzcz1cXFwib3B0LWJ0biBzYXZlXFxcIj4mI3g0RkREOyYjeDVCNTg7PC9wPjwvZGl2PlwifTtcblxuXG5cdF90ZW1wbGF0ZXMuY2hhbm5lbCA9IHtcImNvbnRlbnRcIjpcIjxkaXYgY2xhc3M9XFxcImFtZXJpY2Fuby1jaGFubmVsXFxcIj48ZGl2IGNsYXNzPVxcXCJjaGFubmVsLW9wdGlvbnMgaGlkZS13aGVuLXB1Ymxpc2hcXFwiIHN0eWxlPVxcXCJkaXNwbGF5Om5vbmVcXFwiPjxwIGNsYXNzPVxcXCJzdGF0dXMtbmV3IG9wdC1idG4gY3JlYXRlLWNoYW5uZWxcXFwiPiYjeDY1QjA7JiN4NUVGQTs8L3A+PHAgY2xhc3M9XFxcInN0YXR1cy1lZGl0IG9wdC1idG4gYWRkLXNlY3Rpb25cXFwiPiYjeDZERkI7JiN4NTJBMDsmI3g2QTIxOyYjeDU3NTc7PC9wPjxwIGNsYXNzPVxcXCJzdGF0dXMtZWRpdCBvcHQtYnRuIG9wZW5cXFwiPiYjeDUzRDE7JiN4NUUwMzs8L3A+PC9kaXY+PGRpdiBjbGFzcz1cXFwic2VjdGlvbi1waWNrLXBhbmVsIGhpZGUtd2hlbi1wdWJsaXNoXFxcIj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJoZWFkLXNlY3Rpb25cXFwiPjwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VjdGlvbnMtY29udGFpbmVyXFxcIj48L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XFxcImNoYW5uZWwtc3R5bGVcXFwiPjwvZGl2PjwvZGl2PjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+LmFtZXJpY2Fuby1jaGFubmVse3Bvc2l0aW9uOiByZWxhdGl2ZTttYXJnaW46IDE1cHggYXV0bzsgICAgbWF4LXdpZHRoOiAxMDAwcHg7fS5hbWVyaWNhbm8tY2hhbm5lbCAuY2hhbm5lbC10aXRsZXtwb3NpdGlvbjogYWJzb2x1dGU7bGVmdDogMDt0b3A6IDEwcHg7fS5hbWVyaWNhbm8tY2hhbm5lbCAuY2hhbm5lbC1vcHRpb25ze2JvcmRlci1ib3R0b206IDFweCBzb2xpZCAjYWFhO3RleHQtYWxpZ246IHJpZ2h0O21hcmdpbi1ib3R0b206IDEwcHg7cG9zaXRpb246IHJlbGF0aXZlO30uYW1lcmljYW5vLWNoYW5uZWwgLmNoYW5uZWwtb3B0aW9ucyAub3B0LWJ0bntiYWNrZ3JvdW5kOiAjMjg3NEU0O2NvbG9yOiAjZmZmO3RleHQtYWxpZ246IGNlbnRlcjtwYWRkaW5nOiAycHggMTZweDtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7Y3Vyc29yOiBwb2ludGVyO21hcmdpbjogMTBweDtmb250LXNpemU6IDEycHg7fS5hbWVyaWNhbm8tY2hhbm5lbCAuc2VjdGlvbi1waWNrLXBhbmVse3dpZHRoOiAxMDAlO2Rpc3BsYXk6IG5vbmU7Ym9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNhYWE7ICAgIG1hcmdpbi1ib3R0b206IDE1cHg7ICAgIHBhZGRpbmctYm90dG9tOiAxMHB4O30uYW1lcmljYW5vLWNoYW5uZWwgLnNlY3Rpb24tcHJldmlldy1pdGVte3dpZHRoOiAxMjBweDtkaXNwbGF5OiBpbmxpbmUtYmxvY2s7Ym9yZGVyOiAxcHggc29saWQgI2FhYTttYXJnaW46IDhweDtwYWRkaW5nOiA0cHg7Y3Vyc29yOiBwb2ludGVyO30uYW1lcmljYW5vLWNoYW5uZWwgLnNlY3Rpb24tcHJldmlldy1pdGVtIC5kZXNje3dpZHRoOiAxMDAlO2hlaWdodDogNjBweDsgICAgb3ZlcmZsb3c6IGhpZGRlbjt9LmFtZXJpY2Fuby1jaGFubmVsIC5zZWN0aW9uLXByZXZpZXctaXRlbSAuZGVzYyBpbWd7d2lkdGg6IDEwMCU7fSNicG9wdXBfY29udGVudF9ne3dpZHRoOiAxMDAlO308L3N0eWxlPlwifTtcblxuXG5cdF90ZW1wbGF0ZXMuZGl2aXNpb24gPSB7XCJjb250ZW50XCI6XCI8ZGl2IGNsYXNzPVxcXCJhbWVyaWNhbm8tZGl2aXNpb24gYW1lcmljYW5vLTwlPSBkaXZpc2lvbi5pbmRleCAlPi1kaXZpc2lvblxcXCIgaWQ9XFxcImFtZXJpY2Fuby08JT0gZGl2aXNpb24uZGl2aXNpb25JZCAlPi1kaXZpc2lvblxcXCI+PGRpdiBjbGFzcz1cXFwiZGl2aXNpb24tY29udGFpbmVyXFxcIj48ZGl2IGNsYXNzPVxcXCJkaXZpc2lvbi10aXRsZVxcXCI+PC9kaXY+ICAgICAgICA8ZGl2IGNsYXNzPVxcXCJlbGVtZW50cy1jb250YWluZXJcXFwiPjwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZGl2aXNpb24tc3R5bGUtY29udGFpbmVyXFxcIj48L2Rpdj48L2Rpdj48L2Rpdj5cIn07XG5cblxuXHRfdGVtcGxhdGVzLmVsZW1lbnQgPSB7XCJjb250ZW50XCI6XCI8ZGl2IGNsYXNzPVxcXCJhbWVyaWNhbm8tZWxlbWVudCAgICAgYW0tPCU9YXR0cnMudHlwZSU+LWVsZW1lbnQgICAgYW0tPCU9YXR0cnMuaW5kZXglPi1lbGVtZW50ICAgICBhbS08JT1hdHRycy5jYXRlZ29yeSU+LWVsZW1lbnRcXFwiIGlkPVxcXCJhbS08JT1lbGVtZW50LmVsZW1lbnRJZCU+LWVsZW1lbnRcXFwiPiAgICA8ZGl2IGNsYXNzPVxcXCJlbGVtZW50LWNvbnRlbnRcXFwiPjwvZGl2PiAgICA8ZGl2IGNsYXNzPVxcXCJlbGVtZW50LXN0eWxlLWNvbnRhaW5lclxcXCI+PC9kaXY+PC9kaXY+XCJ9O1xuXG5cblx0X3RlbXBsYXRlcy5odG1sRWxlbWVudCA9IHtcImNvbnRlbnRcIjpcIjwlPWh0bWwlPjwvJT1odG1sJT5cIn07XG5cblxuXHRfdGVtcGxhdGVzLmltYWdlRWxlbWVudCA9IHtcImNvbnRlbnRcIjpcIjwlPWh0bWwlPjwvJT1odG1sJT5cIn07XG5cblxuXHRfdGVtcGxhdGVzLnNlY3Rpb24gPSB7XCJjb250ZW50XCI6XCI8ZGl2IGNsYXNzPVxcXCJhbWVyaWNhbm8tc2VjdGlvblxcXCIgaWQ9XFxcImFtLTwlPSBzZWN0aW9uLnNlY3Rpb25JZCAlPi1zZWN0aW9uXFxcIj48ZGl2IGNsYXNzPVxcXCJhbWVyaWNhbm8tc2VjdGlvbi1jb250YWluZXJcXFwiPjxkaXYgY2xhc3M9XFxcInNlY3Rpb24tdGl0bGUtZWxlbWVudFxcXCI+PC9kaXY+ICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkaXZpc2lvbnMtY29udGFpbmVyXFxcIj48L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XFxcInNlY3Rpb24tc3R5bGUtY29udGFpbmVyXFxcIj48L2Rpdj48L2Rpdj48L2Rpdj5cIn07XG5cblxuXHRfdGVtcGxhdGVzLnRleHRFbGVtZW50ID0ge1wiY29udGVudFwiOlwiPCU9aHRtbCU+PC8lPWh0bWwlPlwifTtcblxuXG5cdF90ZW1wbGF0ZXMub3B0aW9ucyA9IHtcImNvbnRlbnRcIjpcIjxkaXYgY2xhc3M9XFxcImNoYW5uZWwtb3B0aW9ucy1wYW5lbHMgaGlkZS13aGVuLXB1Ymxpc2hcXFwiPjxwIGNsYXNzPVxcXCJwdWJsaXNoXFxcIj4mI3g1M0QxOyYjeDVFMDM7PC9wPjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+LmNoYW5uZWwtb3B0aW9ucy1wYW5lbHMge3Bvc2l0aW9uOiBmaXhlZDt0b3A6IDA7cmlnaHQ6IDA7ei1pbmRleDogMTAwMDtiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwO2NvbG9yOiAjZmZmO3BhZGRpbmc6IDVweCAyMHB4O30uY2hhbm5lbC1vcHRpb25zLXBhbmVscyBwe21hcmdpbjogMDtjdXJzb3I6IHBvaW50ZXI7fTwvc3R5bGU+PC9kaXY+XCJ9O1xuXG5cblx0X3RlbXBsYXRlcy5zZWN0aW9uU25hcHNob3QgPSB7XCJjb250ZW50XCI6XCI8ZGl2IGNsYXNzPVxcXCJzZWN0aW9uLXByZXZpZXctaXRlbVxcXCIgc2VjdGlvbmlkPVxcXCI8JT1zZWN0aW9uSWQlPlxcXCI+PHAgY2xhc3M9XFxcInRpdGxlXFxcIj48JT10aXRsZSU+PC8lPXRpdGxlJT48L3A+ICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkZXNjXFxcIj48JT1odG1sJT48LyU9aHRtbCU+PC9kaXY+PC9kaXY+XCJ9O1xuXG5cblx0X3RlbXBsYXRlcy5zdHlsZV9jbGluZ2hlYWRfc2VjdGlvbiA9IHtcImNvbnRlbnRcIjpcIjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+I2FtLTwlPXNlY3Rpb24uc2VjdGlvbklkJT4tc2VjdGlvbnttYXgtd2lkdGg6IDEwMCU7fSNhbS08JT1zZWN0aW9uLnNlY3Rpb25JZCU+LXNlY3Rpb24gLmRpdmlzaW9ucy1jb250YWluZXJ7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOiByZWxhdGl2ZTtib3JkZXItYm90dG9tOiAxcHggc29saWQgI2RkZDtwYWRkaW5nLWJvdHRvbTogMTBweDt9I2FtLTwlPXNlY3Rpb24uc2VjdGlvbklkJT4tc2VjdGlvbiAuYW1lcmljYW5vLWRpdmlzaW9ue3Bvc2l0aW9uOiByZWxhdGl2ZTttYXJnaW4tYm90dG9tOiAxNXB4O3BhZGRpbmc6IDA7bWluLWhlaWdodDogNjhweDt9I2FtLTwlPXNlY3Rpb24uc2VjdGlvbklkJT4tc2VjdGlvbiAuYW0taW1hZ2UtZWxlbWVudHtwb3NpdGlvbjogYWJzb2x1dGU7bGVmdDogMTBweDt3aWR0aDogMTI0cHg7fSNhbS08JT1zZWN0aW9uLnNlY3Rpb25JZCU+LXNlY3Rpb24gLmFtLWltYWdlLWVsZW1lbnQgLmltYWdlLWZyYW1le3dpZHRoOiAxMjRweDtoZWlnaHQ6IDg0cHg7fSNhbS08JT1zZWN0aW9uLnNlY3Rpb25JZCU+LXNlY3Rpb24gLmFtLWl0ZW10aXRsZS1lbGVtZW50e3BhZGRpbmctbGVmdDoxMzVweDt3aWR0aDogMTAwJTt9I2FtLTwlPXNlY3Rpb24uc2VjdGlvbklkJT4tc2VjdGlvbiAuYW0tZGVzY3JpcHRpb24tZWxlbWVudHtwYWRkaW5nLWxlZnQ6MTM1cHg7d2lkdGg6IDEwMCU7fSNhbS08JT1zZWN0aW9uLnNlY3Rpb25JZCU+LXNlY3Rpb24gLmFtLWl0ZW10aXRsZS1lbGVtZW50IHB7dGV4dC1hbGlnbjogbGVmdDtmb250LXNpemU6IDE2cHg7Zm9udC13ZWlnaHQ6IGJvbGRlcjtwYWRkaW5nOiAwIDEwcHg7bWFyZ2luOiAwO30jYW0tPCU9c2VjdGlvbi5zZWN0aW9uSWQlPi1zZWN0aW9uIC5hbS1kZXNjcmlwdGlvbi1lbGVtZW50IHB7dGV4dC1hbGlnbjogbGVmdDtmb250LXNpemU6IDE0cHg7cGFkZGluZzogMnB4IDEwcHg7fTwvc3R5bGU+XCJ9O1xuXG5cblx0X3RlbXBsYXRlcy5zdHlsZV9kaXZpc2lvbiA9IHtcImNvbnRlbnRcIjpcIjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+I2FtLTwlPSBkaXZpc2lvbi5kaXZpc2lvbklkICU+LWRpdmlzaW9ue3dpZHRoOiA8JT0gZGl2aXNpb25BdHRycy53aWR0aCAlPjt0ZXh0LWFsaWduOiA8JT0gZGl2aXNpb25BdHRycy50ZXh0QWxpZ24gJT47fUBtZWRpYSAobWF4LXdpZHRoOiAxMDAwcHgpeyNhbS08JT0gZGl2aXNpb24uZGl2aXNpb25JZCAlPi1kaXZpc2lvbnt3aWR0aDogPCU9IGRpdmlzaW9uQXR0cnMud2lkdGhUYWJsZXQgJT47fX1AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpeyNhbS08JT0gZGl2aXNpb24uZGl2aXNpb25JZCAlPi1kaXZpc2lvbnt3aWR0aDogPCU9IGRpdmlzaW9uQXR0cnMud2lkdGhNb2JpbGUgJT47fX08L3N0eWxlPlwifTtcblxuXG5cdF90ZW1wbGF0ZXMuc3R5bGVFZGl0UGFuZWwgPSB7XCJjb250ZW50XCI6XCI8c3R5bGUgdHlwZT1cXFwidGV4dC9jc3NcXFwiPi5wb3B1cC1lZGl0LXBhbmVse2JhY2tncm91bmQ6ICNmZmY7cGFkZGluZzogMjBweDt3aWR0aDogMTAwJTttYXJnaW46IDAgYXV0bzt9LnBvcHVwLWVkaXQtcGFuZWwgLnNhdmV7bWFyZ2luLXRvcDogMTJweDtjdXJzb3I6IHBvaW50ZXI7fSNicG9wdXBfY29udGVudF9ne3Bvc2l0aW9uOiBmaXhlZCAhaW1wb3J0YW50O3dpZHRoOiA4MCU7bWF4LXdpZHRoOiA3MjBweDttYXgtaGVpZ2h0OiA4MCU7ei1pbmRleDogOTk5ICFpbXBvcnRhbnQ7fS5fX2ItcG9wdXAxX197ei1pbmRleDogOTkwICFpbXBvcnRhbnQ7fTwvc3R5bGU+XCJ9O1xuXG5cblx0X3RlbXBsYXRlcy5zdHlsZV9lbGVtZW50ID0ge1wiY29udGVudFwiOlwiPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj4jYW0tPCU9ZWxlbWVudC5lbGVtZW50SWQlPi1lbGVtZW50e3dpZHRoOiA8JT1hdHRycy53aWR0aCU+O2hlaWdodDogPCU9YXR0cnMuaGVpZ2h0JT47fSNhbS08JT1lbGVtZW50LmVsZW1lbnRJZCU+LWVsZW1lbnQgLmltYWdlLWZyYW1le3dpZHRoOiA8JT1hdHRycy53aWR0aCU+O2hlaWdodDogPCU9YXR0cnMuaGVpZ2h0JT47fSNhbS08JT1lbGVtZW50LmVsZW1lbnRJZCU+LWVsZW1lbnQgcCwgI2FtLTwlPWVsZW1lbnQuZWxlbWVudElkJT4tZWxlbWVudCBoMywgI2FtLTwlPWVsZW1lbnQuZWxlbWVudElkJT4tZWxlbWVudCBoNSwgI2FtLTwlPWVsZW1lbnQuZWxlbWVudElkJT4tZWxlbWVudCBzcGFue3RleHQtYWxpZ246IDwlPWF0dHJzLnRleHRBbGlnbiU+O2NvbG9yOiA8JT1hdHRycy5jb2xvciU+O2ZvbnQtc2l6ZTogPCU9YXR0cnMuZm9udFNpemUlPjt9QG1lZGlhIChtYXgtd2lkdGg6IDEwMDBweCl7I2FtLTwlPWVsZW1lbnQuZWxlbWVudElkJT4tZWxlbWVudHt3aWR0aDogPCU9YXR0cnMud2lkdGhUYWJsZXQlPjt9fUBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCl7I2FtLTwlPWVsZW1lbnQuZWxlbWVudElkJT4tZWxlbWVudHt3aWR0aDogPCU9YXR0cnMud2lkdGhNb2JpbGUlPjt9fS5hbS1pbWFnZS1lbGVtZW50IC5pbWFnZS1pdGVte21heC13aWR0aDogMTAwJTt9LmFtLWh0bWwtZWxlbWVudCBpZnJhbWV7d2lkdGg6MTAwJTt9PC9zdHlsZT5cIn07XG5cblxuXHRfdGVtcGxhdGVzLnN0eWxlX3NlY3Rpb24gPSB7XCJjb250ZW50XCI6XCI8c3R5bGUgdHlwZT1cXFwidGV4dC9jc3NcXFwiPiNhbS08JT0gc2VjdGlvbi5zZWN0aW9uSWQgJT4tc2VjdGlvbiAuZGl2aXNpb25zLWNvbnRhaW5lcnt9I2FtLTwlPSBzZWN0aW9uLnNlY3Rpb25JZCAlPi1zZWN0aW9ue2JhY2tncm91bmQ6IDwlPSBhdHRycy5iYWNrZ3JvdW5kQ29sb3IgJT47fSNhbS08JT0gc2VjdGlvbi5zZWN0aW9uSWQgJT4tc2VjdGlvbntiYWNrZ3JvdW5kLWltYWdlOiB1cmwoPCU9IGF0dHJzLmJhY2tncm91bmRJbWcgJT4pO2JhY2tncm91bmQtcG9zaXRpb246IDUwJSA1MCU7YmFja2dyb3VuZC1zaXplOiBjb3Zlcjt9I2FtLTwlPSBzZWN0aW9uLnNlY3Rpb25JZCAlPi1zZWN0aW9uIC5zZWN0aW9uLXRpdGxlLWVsZW1lbnQgLmFtLXRleHQtZWxlbWVudCBwe3RleHQtYWxpZ246IGNlbnRlcjtmb250LXNpemU6IDI0cHg7fTwvc3R5bGU+XCJ9O1xuXG5cblx0X3RlbXBsYXRlcy5zdHlsZV9zZXRsaXN0X3NlY3Rpb24gPSB7XCJjb250ZW50XCI6XCI8c3R5bGUgdHlwZT1cXFwidGV4dC9jc3NcXFwiPiNhbS08JT1zZWN0aW9uLnNlY3Rpb25JZCU+LXNlY3Rpb24gLmRpdmlzaW9ucy1jb250YWluZXJ7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOiByZWxhdGl2ZTttYXgtd2lkdGg6MTAwJTt9I2FtLTwlPXNlY3Rpb24uc2VjdGlvbklkJT4tc2VjdGlvbiAuYW1lcmljYW5vLWRpdmlzaW9ue3Bvc2l0aW9uOiByZWxhdGl2ZTttYXJnaW4tYm90dG9tOiAxNXB4O3BhZGRpbmc6IDA7bWluLWhlaWdodDogMTAwcHg7fSNhbS08JT1zZWN0aW9uLnNlY3Rpb25JZCU+LXNlY3Rpb24gLmFtLWltYWdlLWVsZW1lbnR7cG9zaXRpb246IGFic29sdXRlO3RvcDogMDtsZWZ0OiAxMHB4O3dpZHRoOiAxMjRweDt9I2FtLTwlPXNlY3Rpb24uc2VjdGlvbklkJT4tc2VjdGlvbiAuYW0taW1hZ2UtZWxlbWVudCAuaW1hZ2UtZnJhbWV7d2lkdGg6IDEyNHB4O2hlaWdodDogODRweDt9I2FtLTwlPXNlY3Rpb24uc2VjdGlvbklkJT4tc2VjdGlvbiAuYW0taXRlbXRpdGxlLWVsZW1lbnR7cGFkZGluZy1sZWZ0OjEzNXB4O3dpZHRoOiAxMDAlO30jYW0tPCU9c2VjdGlvbi5zZWN0aW9uSWQlPi1zZWN0aW9uIC5hbS1kZXNjcmlwdGlvbi1lbGVtZW50e3BhZGRpbmctbGVmdDoxMzVweDt3aWR0aDogMTAwJTt9I2FtLTwlPXNlY3Rpb24uc2VjdGlvbklkJT4tc2VjdGlvbiAuYW0taXRlbXRpdGxlLWVsZW1lbnQgcHt0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtc2l6ZTogMTZweDtmb250LXdlaWdodDogYm9sZGVyO3BhZGRpbmc6IDJweCAxMHB4O30jYW0tPCU9c2VjdGlvbi5zZWN0aW9uSWQlPi1zZWN0aW9uIC5hbS1kZXNjcmlwdGlvbi1lbGVtZW50IHB7dGV4dC1hbGlnbjogbGVmdDtmb250LXNpemU6IDE0cHg7cGFkZGluZzogMnB4IDEwcHg7fUBtZWRpYSAobWF4LXdpZHRoOiA0ODBweCl7I2FtLTwlPXNlY3Rpb24uc2VjdGlvbklkJT4tc2VjdGlvbiAuYW1lcmljYW5vLWRpdmlzaW9ue2JvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO21hcmdpbjogMCBhdXRvIDE1cHg7d2lkdGg6IDkwJTtwYWRkaW5nOjA7fSNhbS08JT1zZWN0aW9uLnNlY3Rpb25JZCU+LXNlY3Rpb24gLmFtLWltYWdlLWVsZW1lbnR7cG9zaXRpb246IHJlbGF0aXZlO2xlZnQ6IDBweDt3aWR0aDogMTAwJTt9I2FtLTwlPXNlY3Rpb24uc2VjdGlvbklkJT4tc2VjdGlvbiAuYW0taW1hZ2UtZWxlbWVudCAuaW1hZ2UtZnJhbWV7d2lkdGg6IDEwMCU7aGVpZ2h0OiAxNDZweDttYXJnaW46IDZweCBhdXRvO30jYW0tPCU9c2VjdGlvbi5zZWN0aW9uSWQlPi1zZWN0aW9uIC5hbS1pdGVtdGl0bGUtZWxlbWVudHtwYWRkaW5nOjBweDt3aWR0aDogMTAwJTt9I2FtLTwlPXNlY3Rpb24uc2VjdGlvbklkJT4tc2VjdGlvbiAuYW0tZGVzY3JpcHRpb24tZWxlbWVudHtwYWRkaW5nOjBweDt3aWR0aDogMTAwJTt9fTwvc3R5bGU+XCJ9O1xuXG5cblx0X3RlbXBsYXRlcy5zdHlsZVNsaWNrID0ge1wiY29udGVudFwiOlwiPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj4uc2xpY2stZG90c3t0ZXh0LWFsaWduOiBjZW50ZXI7cG9zaXRpb246IGFic29sdXRlO2JvdHRvbTogMDt3aWR0aDogMTAwJTt9LnNsaWNrLWRvdHMgbGl7ZGlzcGxheTogaW5saW5lLWJsb2NrO2JvcmRlci1yYWRpdXM6IDEwMCU7ICAgIHdpZHRoOiA4cHg7ICAgIGhlaWdodDogOHB4OyAgICBiYWNrZ3JvdW5kOiAjOTk5OyAgICBtYXJnaW46IDEwcHg7fS5zbGljay1kb3RzIGxpIGJ1dHRvbntkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7fS5zbGljay1kb3RzbGkuc2xpY2stYWN0aXZle2JhY2tncm91bmQ6ICNkZGQ7fS5zbGljay1wcmV2LWFycm93LCAuc2xpY2stbmV4dC1hcnJvd3tjdXJzb3I6IHBvaW50ZXI7ei1pbmRleDogMjQ7Y29sb3I6ICNGRkY7ICAgIGRpc3BsYXk6IGlubGluZS1ibG9jazsgICAgem9vbTogMTtvcGFjaXR5OiAwLjc1O30uc2xpY2stcHJldi1hcnJvd3twb3NpdGlvbjogYWJzb2x1dGU7bGVmdDogMDt0b3A6IDQ1JTt9LnNsaWNrLW5leHQtYXJyb3d7cG9zaXRpb246IGFic29sdXRlO3JpZ2h0OiAwO3RvcDogNDUlO308L3N0eWxlPlwifTtcblxuXG5mdW5jdGlvbiByZW5kZXIoIG9iaix0ZW1wbGF0ZSkge1xuXHRpZighX3RlbXBsYXRlc1t0ZW1wbGF0ZV0pe1xuXHRcdGNvbnNvbGUubG9nKHRlbXBsYXRlKTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIHRlbXBsYXRlID0gbmV3IEVKUyh7dGV4dDogX3RlbXBsYXRlc1t0ZW1wbGF0ZV0uY29udGVudH0pO1xuICAgIHJldHVybiB0ZW1wbGF0ZS5yZW5kZXIob2JqKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyO1xuIiwicmVxdWlyZSAoJy4uL2xpYi9zaWQnKTtcblxudmFyIGhvc3QgPSAnaHR0cHM6Ly9zMy5jbi1ub3J0aC0xLmFtYXpvbmF3cy5jb20uY24vY2hhbm5lbC5jZG4vbGliLyc7XG4vLyB2YXIgaG9zdCA9IGxvY2F0aW9uLm9yaWdpbiArIFwiL2xpYi9cIjtcblxud2luZG93LkNWTSA9IHdpbmRvdy5DVk0gfHwge307XG5cbndpbmRvdy5DVk0udmVyZG9ycyA9IFt7XG5cdFx0bmFtZSA6IFwidW5kZXJzY29yZVwiLFxuXHRcdHNvdXJjZSA6IFt7XG5cdFx0XHR0eXBlIDogXCJqc1wiLFxuXHRcdFx0ZmlsZSA6IFwidW5kZXJzY29yZS91bmRlcnNjb3JlLm1pbi5qc1wiXG5cdFx0fV1cblx0fSx7XG5cdFx0bmFtZSA6IFwicWluaXVcIixcblx0XHRzb3VyY2UgOiBbe1xuXHRcdFx0dHlwZSA6IFwianNcIixcblx0XHRcdGZpbGUgOiBcInFpbml1L3BsdXBsb2FkLmZ1bGwubWluLmpzXCJcblx0XHR9LHtcblx0XHRcdHR5cGUgOiBcImpzXCIsXG5cdFx0XHRmaWxlIDogXCJxaW5pdS9xaW5pdS5qc1wiXG5cdFx0fV1cblx0fSx7XG5cdFx0bmFtZSA6IFwiYlBvcHVwXCIsXG5cdFx0c291cmNlIDogW3tcblx0XHRcdHR5cGUgOiBcImpzXCIsXG5cdFx0XHRmaWxlIDogXCJiUG9wdXAvYlBvcHVwLmpzXCJcblx0XHR9XVxuXHR9LHtcblx0XHRuYW1lIDogXCJ1ZWRpdG9yXCIsXG5cdFx0c291cmNlIDogW3tcblx0XHRcdHR5cGUgOiBcImpzXCIsXG5cdFx0XHRmaWxlIDogXCJ1ZWRpdG9yL3VlZGl0b3IuY29uZmlnLmpzXCJcblx0XHR9LHtcblx0XHRcdHR5cGUgOiBcImpzXCIsXG5cdFx0XHRmaWxlIDogXCJ1ZWRpdG9yL3VlZGl0b3IuYWxsLm1pbi5qc1wiXG5cdFx0fV1cblx0fSx7XG5cdFx0bmFtZSA6IFwic2xpY2tcIixcblx0XHRzb3VyY2UgOiBbe1xuXHRcdFx0dHlwZSA6IFwianNcIixcblx0XHRcdGZpbGUgOiBcInNsaWNrL3NsaWNrLmpzXCJcblx0XHR9LHtcblx0XHRcdHR5cGUgOiBcImNzc1wiLFxuXHRcdFx0ZmlsZSA6IFwic2xpY2svc2xpY2suY3NzXCJcblx0XHR9XVxuXHR9XG5dO1xuXG5mdW5jdGlvbiBwcmVwYXJlIChuYW1lLCBjYWxsYmFjayl7XG5cdC8vIHZhciBkZWZlcnMgPSBbXTtcblx0dmFyIHNjcmlwdHMgPSBbXTtcblx0dmFyIGNzcyA9IFtdO1xuXHR2YXIgc2NyaXB0RGl2ID0gJChcIiNjdm0tdmVyZG9yLXNjcmlwdHNcIikuZ2V0KDApID8gJChcIiNjdm0tdmVyZG9yLXNjcmlwdHNcIikuZ2V0KDApIDogJChcIjxkaXYgaWQ9J2N2bS12ZXJkb3Itc2NyaXB0cyc+PC9kaXY+XCIpLmFwcGVuZFRvKCQoXCJib2R5XCIpKTtcblxuXHRmb3IodmFyIGkgPSAwIDsgaSA8IHdpbmRvdy5DVk0udmVyZG9ycy5sZW5ndGg7IGkrKyl7XG5cdFx0aWYoIXdpbmRvdy5DVk0udmVyZG9yc1tpXS5sb2FkZWQgJiYgbWF0Y2hlcyh3aW5kb3cuQ1ZNLnZlcmRvcnNbaV0ubmFtZSwgbmFtZSkpe1xuXHRcdFx0dmFyIHNvdXJjZXMgPSB3aW5kb3cuQ1ZNLnZlcmRvcnNbaV0uc291cmNlO1xuXHRcdFx0Zm9yKHZhciBqID0gMCA7IGogPCBzb3VyY2VzLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0aWYoc291cmNlc1tqXS50eXBlID09ICdqcycpe1xuXHRcdFx0XHRcdHZhciBmaWxlID0gaG9zdCArICBzb3VyY2VzW2pdLmZpbGU7XG5cdFx0XHRcdFx0c2NyaXB0cy5wdXNoKGZpbGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoc291cmNlc1tqXS50eXBlID09ICdjc3MnKXtcblx0XHRcdFx0XHR2YXIgZmlsZSA9IGhvc3QgKyBzb3VyY2VzW2pdLmZpbGU7XG5cdFx0XHRcdFx0JCgnaGVhZCcpLmFwcGVuZCggJCgnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIC8+JykuYXR0cignaHJlZicsIGZpbGUpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuICAgIFNpZC5qcyhzY3JpcHRzLCBmdW5jdGlvbigpIHtcbiAgICBcdGNhbGxiYWNrKCk7XG5cdH0sICQoc2NyaXB0RGl2KS5nZXQoMCkpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVWZXJkb3JTdGF0dXMobmFtZSl7XG5cdGZvcih2YXIgaSA9IDAgOyBpIDwgd2luZG93LkNWTS52ZXJkb3JzLmxlbmd0aDsgaSsrKXtcblx0XHRpZihtYXRjaGVzKHdpbmRvdy5DVk0udmVyZG9yc1tpXS5uYW1lLCBuYW1lKSlcblx0XHRcdHdpbmRvdy5DVk0udmVyZG9yc1tpXS5sb2FkZWQgPSB0cnVlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGxvYWRTY3JpcHQodXJsKSB7XG5cdHZhciBkZWZlciA9IHdoZW4uZGVmZXIoKTtcbiAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKVxuICAgIHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcblxuICAgIGlmIChzY3JpcHQucmVhZHlTdGF0ZSkgeyAvL0lFXG4gICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoc2NyaXB0LnJlYWR5U3RhdGUgPT0gXCJsb2FkZWRcIiB8fCBzY3JpcHQucmVhZHlTdGF0ZSA9PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBkZWZlci5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHsgLy9PdGhlcnNcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlZmVyLnJlc29sdmUoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzY3JpcHQuc3JjID0gdXJsO1xuICAgIHZhciBzY3JpcHREaXYgPSAkKFwiI2N2bS12ZXJkb3Itc2NyaXB0c1wiKS5nZXQoMCkgPyAkKFwiI2N2bS12ZXJkb3Itc2NyaXB0c1wiKS5nZXQoMCkgOiAkKFwiPGRpdiBpZD0nY3ZtLXZlcmRvci1zY3JpcHRzJz48L2Rpdj5cIikuYXBwZW5kVG8oJChcImJvZHlcIikpO1xuICAgICQoc2NyaXB0RGl2KS5hcHBlbmQoc2NyaXB0KTtcbiAgICByZXR1cm4gZGVmZXIucHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcyhuYW1lLCByZXF1aXJlKXtcblx0aWYodHlwZW9mIHJlcXVpcmUgPT0gXCJzdHJpbmdcIil7XG5cdFx0cmV0dXJuIG5hbWUgPT0gcmVxdWlyZTtcblx0fWVsc2V7XG5cdFx0dmFyIHJlc3VsdCA9IGZhbHNlO1xuXHRcdGZvcih2YXIgaSA9IDAgOyBpIDwgcmVxdWlyZS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRpZihyZXF1aXJlW2ldID09IG5hbWUpXG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcmVwYXJlOyJdfQ==
