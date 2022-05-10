const focusableElements ="a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

/* 접근성(tab-select) */
let tabChange = {
	tab : $('[data-rule="tab"]') ,//tab ele
	focusEl : $(['[aria-selected]']), //
	//tablist : $('[data-rule="tablist"]') , // tab list 
	init : function(){
		_this = this;
		_this.event(_this);
		_this.keyEvent();
	},
	event : function(){
		$(document).on('click' , _this.tab , function(e){
			target = $(e.target); // 이벤트 타겟
			if(target.attr('data-rule') !=='tab'){
				target = target.closest('[data-rule="tab"]'); // 탭구조가 다를시에 타겟 재조정
			}
			tabpanelId = target.attr('id');
			parent = target.closest('[data-rule="tablist"]'); // 이벤트 타겟 tablist
			
			target//탭 상태 값 및 attr 변경
			.attr({
				'aria-selected':'true',
				'title':'선택됨'
			})
			.addClass('current')
			.siblings()
			.removeClass('current')
			.attr({
				'aria-selected':'false',
				'title':''
			});
			$('[aria-labelledby="'+tabpanelId+'"]').show().siblings('[data-rule="tabpanel"]').hide();//선택된 탭 콘텐트 show
		});
		
	},
	keyEvent : function(){ //접근성 탭 좌우 버튼
		$(document).on('keydown',  '[data-rule="tablist"]' , function(e){
			if(e.keyCode === 39){
				console.log('123');
			} else if(e.keyCode === 37){
				console.log('456');
			}
		});	
	},
	focusIn : function(){ //키보드로 진입시 활성화된 탭이 첫번째가 아닐때 포커스 재조정 
		
	},
	reload : function(){
		
	}
}
/* 접근성(auto-caption) */
let accessTable = {
	titleEle : 'h3, h4, h5, .tbl-tit', // 테이블 제목 요소
	parentNode : 'box_table', //테이블 제목을 찾기위한 부모노드
	init : function() {
		_this = this;
		_this.event(_this);
	},
	event : () => {
		target = $('[data-caption-auto="true"]'); //auto caption target 지정
		target.each(function(){
			title = $(this).closest('.' + _this.parentNode).find(_this.titleEle).text();
			scope = '';
			total = $(this).find('[scope]').length - 1
			if(!title.length){
				$(this).attr('data-table-title') === undefined ? title = $('title').text() : title = $(this).attr('data-table-title');
			}
			scopetxt = '';
			$(this).find('[scope]').each(function(i){
				i < total ? scopeItem = $(this).text() + ', ' : scopeItem = $(this).text();//마지막 scope 요소 쉼표 제거
				scope += scopeItem;
			});
			$(this).find('caption').html(title + ' - ' + scope + '항목으로 구성된 표입니다.')
		});
	}
}

/* modal-popup */
let popup = {
	btntarget : '[onclick*="popup.open"]', //팝업 오픈 target 정의
	open : (popupId , btnId) => {//팝업 open
		target = '#' + popupId;
		focusEl = $(target).find(focusableElements) // 팝업내 포커스 요소
		if(btnId === undefined || btnId === ''){//open 버튼요소에 btnId를 입력하지 않았거나 버튼 id가 없을때
			popup.findBtn(popupId);//btnid가 없는경우 해당 버튼을 찾아 data-attr추가
		} else {
			$(target).attr('data-focus-btn', btnId);//닫기시 포커스 id와 비교하기 위해 data-attr추가
		}
		$('html').addClass('modal-open');
		$(target).addClass('active');

		//접근성 관련
		$(focusEl[0]).focus(); //팝업내 첫번째 포커스 요소에 포커스
		popup.focusLoop();//팝업내 loop function 실행

		//callback
		if(!$(target).hasClass('modal-alert')){//알럿팝업인경우 예외처리
			popup.bgClose(popupId);//팝업 배경 클릭시에 팝업 close 실행
		}
		hashChange.modal(popupId);//history back 클릭시에 팝업 닫기 실행
		popup.multyCheck();//멀티 팝업일때 배경 중첩 제어
		popup.setCloseTxt(popupId); //팝업 닫기 버튼 텍스트 생성시 추가
	},
	close : (popupId , focusId) => {//팝업 close
		$target = $('#' + popupId); //닫기 팝업 id
		$focusBtn = $('#' + focusId); //팝업 닫기시 focusId
		compareFocus = $target.attr('data-focus-btn'); //focusId가 정상적으로 들어갔는지 비교
		$target.removeClass('active').removeAttr('data-focus-btn');
		
		if($focusBtn.length !== 0 && compareFocus !== undefined){ //focusId 값이 있으며 해당 id값을 가진 포커스 요소가 있을때
			$focusBtn === compareFocus
			? $focusBtn.focus()
			: $('#' + compareFocus).focus();
		} else {
			$('button[data-focus-prop]').focus().removeAttr('data-focus-prop');
		}
		popup.multyCheck();//멀티 팝업일때 배경 중첩 제어
	},
	findBtn : (idx) =>{//open 버튼요소에 id를 입력하지 않거나 id가 없을때
		$(popup.btntarget).each(function(){
			if($(this).attr('onclick').indexOf(idx) !== -1){
				$(this).attr('data-focus-prop' , true);
			}
		});
	},
	focusLoop : () =>{//팝업 오픈시 포커스 loop
		$(document).on('keydown' , target , function(e){
			focusLen = focusEl.length - 1; //오픈한 팝업내에 포커스 요소 length 체크
			focusItem = $(':focus'); //팝업내 포커스 된 요소
			focusIndex = focusEl.index(focusItem);//팝업내 포커스된 요소 index 체크
			if(e.keyCode === 9 && !e.shiftKey){
				focusIndex = focusIndex + 1
				//console.log(focusIndex)
				if(focusIndex > focusLen){
					focusEl.eq(0).focus();
					e.preventDefault(); //keyup event 방지
				}
			}
			if(e.keyCode === 9 && e.shiftKey){
				focusIndex = focusIndex - 1
				//console.log(focusIndex)
				if(focusIndex < 0){
					focusEl[focusLen].focus(); //배열 순번으로 포커스 요소 선택가능
					e.preventDefault(); //keyup event 방지
				}
			}
			
		});
	},
	bgClose : (idx) =>{//백그라운드 클릭시 팝업 닫기
		$(document).on('click' , function(e){
			eventTarget = $(e.target).attr('id');//팝업 배경을 타겟으로 설정
			if(idx === eventTarget){
				return popup.close(idx);
			}
		});
	},
	setCloseTxt : (idx) =>{//팝업 닫기 버튼 텍스트 생성
		rootEle = $('#' + idx);
		$target = rootEle.find('.btn-close');
		closeTit = rootEle.find('h1').text() + ' 팝업 닫기';
		$target.text(closeTit);
	},
	multyCheck : () => {//2개이상의 팝업이 열릴경우 dim이 겹치지 않게 제어
		len = $('.modal-popup.active').length - 1;
		len === -1 ? $('html').removeClass('modal-open') : false;
		if(len > 0){
			$('.modal-popup.active').each(function(index){
				console.log(index , len)
				index !== len
				? $(this).attr('data-bg' , false)
				: $(this).attr('data-bg' , true);
			});
		} else {
			$('.modal-popup.active').removeAttr('data-bg');
		}
	}
}
//hash change
let hashChange = {//hash change event
	modal : (idx) => {
		window.location.hash = 'openPop'
		$(window).on('hashchange' , function(){
			hash = location.hash;
			if(hash === ''){
				popup.close(idx);
			}
		});
	}
}

//accordion
let accord = {
	accordBtn : '.accord_btn',
	init : function(){
		_this = this;
		_this.event(_this);
	},
	event : () => {
		
	},
	//callback
	setTitle : () => { // 아코디언 초기 타이틀 값 셋팅
		$('.accord_wrap').find(_this.accordBtn).each(function(){ 
			title = $(this).text();
			$(this).attr('title' , title + ' 상세열기');
		});
	},
	reset : () => { //기존에 열려있는 아코디언 닫기
		targetDiv.siblings().removeClass('active').find('.accord_con').slideUp(100);
		targetDiv.siblings().find(accord.accordBtn).attr('title' , title.replace('닫기' ,'열기'))
	},
	setShow : () => {//초기 펼침 형태 셋팅
		$('.accord_item').each(function(){
			type = $(this).attr('data-show');
			title = $(this).find('a.accord_btn').attr('title');
			txt = $(this).find('button.accord_btn').text();
			if(type === 'true'){
				$(this).addClass('active');
				$(this).find('.accord_con').show();
				title !== undefined
				? $(this).find('.accord_btn').attr('title' , title.replace('열기' ,'닫기'))
				: $(this).find('.accord_btn span').text(txt.replace('열기' , '닫기'))
			}
		});
	}
}

//dropbox123123123123123
let dropbox = {

}

// check box
let checkbox = {
	init : function(){
		_this = this;
		_this.event();
	},
	event : () => {//checkbox check event
		$(document).on('change' , '.chk_wrap input[type="checkbox"]' , function(){
			_this = $(this);
			chkDiv = _this.closest('.chk_wrap');//체크 root ele
			chkItem = _this.closest('.accord_item');//아코디언 형태의 1단계 ele
			chkCon = _this.closest('.chk_items'); //아코디언 형태의 2단계 ele
			chkList = _this.closest('.chk_list'); //최하위 단계 ele
			chkCls = _this.parent().attr('class'); //변경된 checkbox 부모 class
			chkItem.length === 1 ? chkEle = chkCon : chkEle = chkDiv; //2단구조와 3단 구조일때 타겟 변경
			
			switch(chkCls){
				case 'chk_all' :
				chkDiv.find('input[type="checkbox"]').prop('checked' , _this.prop('checked'));
				break;
				case 'chk' :
				chkItem.find('input[type="checkbox"]').prop('checked' , _this.prop('checked'));
				break;
				case 'chk01' :
				chkEle.find('.chk_list input[type="checkbox"]').prop('checked' , _this.prop('checked'));
				chkList = chkEle.find('.chk_list');
				break;
			}
			checkbox.eachEvent();

			/* callback */
			checkbox.slideUp('chk_all'); //전체 체크 클릭시에 슬라이드 업 callback
			checkbox.checkVaild('vaild' , 'vaild_btn');//check vaildation callback
			checkbox.checkResetClass();
		});

	},
	eachEvent : () => { //children loop check
		chkArray = [];
		chkArray01 = [];
		chkArray02 = [];
		chkList.find('li').each(function(){
			prop = $(this).find('input').prop('checked');
			chkArray02 += prop;
		});
		if(chkCls !== 'chk_all'){//전체 체크일때 예외 처리
			chkArray02.indexOf('false') === -1 
			? chkEle.find('.chk01 input[type="checkbox"]').prop('checked' , true)
			: chkEle.find('.chk01 input[type="checkbox"]').prop('checked' , false);
		}

		chkItem.find('.chk01').each(function(){
			prop = $(this).find('input').prop('checked');
			chkArray01 += prop;
		});
		if(chkItem.length){
			chkArray01.indexOf('false') === -1 
			? chkItem.find('.chk input[type="checkbox"]').prop('checked' , true)
			: chkItem.find('.chk input[type="checkbox"]').prop('checked' , false);

			chkDiv.find('.chk').each(function(){
				prop = $(this).find('input').prop('checked');
				chkArray += prop;
			});
			
			chkArray.indexOf('false') === -1 
			? chkDiv.find('.chk_all input[type="checkbox"]').prop('checked' , true)
			: chkDiv.find('.chk_all input[type="checkbox"]').prop('checked' , false);
		}
		
	},

	//callback
	checkVaild : (chkId , btnId) => { //vaildation check callback;
		$target = $('#' + chkId);
		$btn = $('#' + btnId)
		vaildArray = [];
		$target.find('input').each(function(){
			prop = $(this).prop('checked');
			vaildArray += prop;
		});
		vaildArray.indexOf('false') === -1
		? $btn.removeClass('disabled')
		: $btn.addClass('disabled');
	},
	slideUp : (cls) => { //지정 클레스 slideup
		val = $('.' + cls).find('input[type="checkbox"]').prop('checked');
		slideEle = _this.closest('.chk_wrap').find('.accord_item');
		if(val === true){
			slideEle.removeClass('active').find('.accord_con').slideUp(100);
		}
	},
	checkResetClass : () => { //체크 클릭시 error 클레스 제거
		//resetCon = $('#' + idx);
		chkDiv.find('input[type="checkbox"]').each(function(){
			prop = $(this).prop('checked');
			if(prop === true){
				$(this).next('label').removeClass('error');
			}
		});
	}
}
// input box
let inputbox = {
	focusEle : 'input[type="text"] , input[type="number"] , input[type="password"]' ,
	parentEle : '.box_input , .box_input_cell',
	event : () => {
		inputbox.focus();
		inputbox.clear();
	},
	focus : () => {
		$(document).on('focusin' , inputbox.focusEle , function(){//focusin
			changeEle = $(this).closest('.box_input');
			changeEle.addClass('focused');
		});
		
		$(document).on('focusout' , inputbox.focusEle , function(){//focusout
			changeEle = $(this).closest('.box_input');
			changeEle.removeClass('focused')
		});
		inputbox.keyEvent();
	},
	keyEvent : () => {
		$(document).on('keyup' , inputbox.focusEle , function(){//completed
			val = $(this).val();
			if(val.length !== 0){
				$(this).closest('.box_input').addClass('completed').find('.btn_del').addClass('on');
			} else {
				$(this).closest('.box_input').removeClass('completed').find('.btn_del').removeClass('on');
			}
		});	
	},
	valChk : () => {
		
	},
	clear : () => {
		$(document).on('click' , '.btn_del' , function(){//completed
			clearVal = '';
			$(this).removeClass('on').closest(inputbox.parentEle)
			.removeClass('completed').find(inputbox.focusEle).val(clearVal);
		});
	},
	masking : () => {
		$('input[type="password"]').each(function(){
			length = $(this).attr('maxlength');
			target = '.masking';
			for(i=0; i < length; i++){
				console.log(i)
			}
		});
	}

	
}

let vaildChk = {
	click : (idx) => { //클릭 이벤트로 vaildation 체크시
		vaildCon = $('#' + idx);
		vaildCon.find('input[type="checkbox"]').each(function(){
			prop = $(this).prop('checked');
			if(prop === false){
				$(this).next('label').addClass('error');
			}
		});
	}
}


let error = {
	msg : (txt) =>{

	}
}

//< , > 문자열 변경
let charChange = {
	init : function(){
		_this = this;
		_this.event();
	},
	event : function(){
		$('pre').each(function(){
			txt = $(this).html();
			replaceTxt = txt.replace(/</gi , '&lt;');
			replaceTxt = replaceTxt.replace(/>/gi , '&gt;');
			$(this).html(replaceTxt)
		});
		
	}
}

let commonUi = {//공통적으로 로드할 function 정의
	init : function(){
	}
}
$(document).ready(function(){
	tabChange.init();
	accessTable.init();
	checkbox.init();
	accord.init();
	charChange.init();
	inputbox.event();
});


