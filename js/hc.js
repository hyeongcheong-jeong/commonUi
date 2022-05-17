const focusableElements ="a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

/* 접근성(tab-select) */
let tabChange = {
	tab : $('[data-rule="tab"]') ,//tab ele
	focusEl : $(['[aria-selected]']), //
	//tablist : $('[data-rule="tablist"]') , // tab list 
	init : function(){
		$('[data-rule="tab"]').attr('onclick' , 'return false;')
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
	keyEvent : () =>{ //접근성 탭 좌우 버튼
		$(document).on('keydown',  '[data-rule="tablist"]' , function(e){
			if(e.keyCode === 39){
				console.log('123');
			} else if(e.keyCode === 37){
				console.log('456');
			}
		});	
	},
	focusIn : () => { //키보드로 진입시 활성화된 탭이 첫번째가 아닐때 포커스 재조정 
		
	},
	reset : (tabCls , tabConCls) => {
	},
	reload : () => {
		
	},
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
	},
	
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
	init : function(){
		_this = this;
		_this.event();
		_this.setShow();//초기 펼침 형태 셋팅시 사용
	}, 
	event : () => {
		parentElement = '.accord_items , .accord_list_items';//parent element
		exceptEle = '.accord_list_items , .chk_wrap';//예외처리할 클레스
		$(document).on('click' , '.accord_btn' , function(){
			rootEle = $(this).closest('.accord_wrap');
			parentNode = $(this).closest(parentElement);
			targetId = $(this).attr('aria-controls');
			if(parentNode.hasClass('active')){
				accord.slideUp();
				$(this).attr('aria-expanded' , 'false');
			} else {
				accord.slideDown();
				$(this).attr('aria-expanded' , 'true');
				$(this).closest(exceptEle).length === 0 
				? accord.reset()
				: false
			}
		});
	},
	slideUp : () => { //슬라이드 업
		parentNode.removeClass('active');
		parentNode.find('> .accord_con').slideUp(100);
		//$('#' + targetId).slideUp(100);
	},
	slideDown : () => { //슬라이드 다운
		parentNode.addClass('active');
		parentNode.find('> .accord_con').slideDown(100);
		//$('#' + targetId).slideDown(100);
	},
	//callback
	reset : () => { //기존에 열려있는 아코디언 닫기
		parentNode.siblings().removeClass('active').children('.accord_con').slideUp(100);
		parentNode.siblings().children('.accord_head').find('.accord_btn').attr('aria-expanded' , 'false');
	},
	setShow : () => {//초기 펼침 형태 셋팅
		$(parentElement).each(function(){
			type = $(this).attr('data-show');
			if(type === 'true'){
				$(this).addClass('active').find('.accord_btn').attr('aria-expanded' , 'true');
				$(this).children('.accord_con').show();
			}
		});
	},
	ajaxSample : () => {
		setTimeout(function(){
			html = '<dl class="accord_items">' +
						'<dt class="accord_head">' +
							'<button type="button" id="accordion1" class="accord_btn" aria-expanded="false" aria-contros="accord_con1">아코디언 제목1</button>' +
						'</dt>' +
						'<dd class="accord_con" id="accord_con1" aria-labelledby="accordion1">내용내용내용내용내용내용내용내용 내용내용내용내용내용내용내용내용 내용내용내용내용내용내용내용내용 내용내용내용내용내용내용내용내용 내용내용내용내용내용내용내용내용 내용내용내용내용내용내용내용내용</dd>' +
					'</dl>'
			$('.accord_wrap').append(html)
		} , 2000);
	}
}

// custom select type
let selectbox = {
	init : function(){
		_this = this;
		_this.event();
	},
	event : () => {
		$(document).on('click' , '.selectbox_header button' , function(){
			rootElement = $(this).closest('.selectbox_wrap');
			slideTarget = rootElement.find('.selectbox_body');
			changeTarget = rootElement.find('.selectbox_header button');
			if(rootElement.hasClass('active')){
				$(this).attr('aria-expanded' , false);
				selectbox.slideUp(slideTarget);
			} else {
				$(this).attr('aria-expanded' , true);
				selectbox.slideDown(slideTarget);
			}
		});
		_this.checkVal();
	},
	slideDown : (target) => {
		$('.selectbox_wrap').each(function(){
			$(this).removeClass('active');
		});
		rootElement.addClass('active');
		target.slideDown(100 , function(){
			$(this).find('.selected button').focus();
			selectbox.optionLoop();
		})
	},
	slideUp : (target) => {
		rootElement.removeClass('active');
		target.slideUp(100);
	},
	checkVal : () => {
		$('.selectbox_list li').each(function(){//초기 셀렉트 값 체크
			if($(this).hasClass('selected')){
				html = $(this).find('button').html();
				changeTarget = $(this).closest('.selectbox_wrap').find('.selectbox_header button');
				return changeTarget.html(html);
			}
		});
		$(document).on('click' , '.selectbox_list button' , function(){
			html = $(this).html();
			$(this).closest('li').addClass('selected').siblings().removeClass('selected');
			selectbox.slideUp(slideTarget);
			changeTarget.html(html).focus();
		});
	},
	optionLoop : () =>{
		$(document).on('keydown' , '.selectbox_list button[type="button"]' , function(e){
			targetEl = $(this).closest('.selectbox_list').find('button[type="button"]');
			targetLen = targetEl.length - 1;
			targetfocusItem = $(':focus'); //팝업내 포커스 된 요소
			focusIndex = targetEl.index(targetfocusItem);//팝업내 포커스된 요소 index 체크
			if(e.keyCode === 9 && !e.shiftKey){
				focusIndex = focusIndex + 1
				if(focusIndex > targetLen){
					targetEl.eq(0).focus();
					e.preventDefault(); //keyup event 방지
				}
			}
			if(e.keyCode === 9 && e.shiftKey){
				focusIndex = focusIndex - 1
				if(focusIndex < 0){
					targetEl[targetLen].focus(); //배열 순번으로 포커스 요소 선택가능
					e.preventDefault(); //keyup event 방지
				}
			}
		});
	}
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
			chkItem = _this.closest('.accord_items');//아코디언 형태의 1단계 ele
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
		slideEle = _this.closest('.chk_wrap').find('.accord_items');
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
	event : () => {
		focusEle = 'input[type="text"] , input[type="number"] , input[type="password"] , .input_btn button , select:not([disabled])';
		vaildEle = 'input[type="text"] , input[type="number"] , input[type="password"] , select:not([disabled])';
		rootNode = '.box_input'; //focused , keep 요소
		parentEle = '.box_input_cell , .input_btn'; //focus-in 요소
		inputbox.load();//input에 값을 가지고 있는경우
		inputbox.focus();
		inputbox.clear();
		inputbox.masking();//마스킹 요소가 필요할때 사용
	},
	focus : () => {
		$(document).on('focusin' , focusEle , function(){//focusin
			$(this).closest(rootNode).addClass('focused');
			$(this).closest(parentEle).addClass('focus-in');
			if($(this).val().length !== 0 && !$(this).attr('readonly')){
				$(this).closest(parentEle)
				.find('.btn_del')
				.addClass('on');
			}
		});
		
		$(document).on('focusout' , focusEle , function(){//focusout
			$(this).closest(rootNode).removeClass('focused');
			$(this).closest(parentEle).removeClass('focus-in');
		});
		inputbox.keyEvent();
	},
	keyEvent : () => {
		$(document).on('keyup , change' , vaildEle , function(){//completed
			val = $(this).val();
			rowType = $(this).closest(rootNode).find('.box_input_cell').length;
			if(val !== ''){
				$(this).closest(parentEle)
				.removeClass('error')//vaildation check시에 에러 클레스 제거 필요시 사용
				.addClass('completed')
				.find('.btn_del')
				.addClass('on');
				error.del($(this).closest(parentEle))
			} else {
				$(this).closest(parentEle).removeClass('completed').find('.btn_del').removeClass('on');
			}

			if(rowType > 1){//parentEle 가 2개 이상일때 label 제어
				$(this).closest(rootNode).find('.completed').length === 0 
				? $(this).closest(rootNode).removeClass('keep')
				: $(this).closest(rootNode).addClass('keep');
			}
		});	
	},
	clear : () => {//input value 초기화 함수
		$(document).on('click' , '.btn_del' , function(){//completed
			clearVal = '';
			$(this).removeClass('on')
			.closest('.box_input_cell')
			.removeClass('completed')
			.find(focusEle)
			.val(clearVal);
		});
	},
	load : () => {//default value 값이 있을때 label제어
		$(vaildEle).each(function(){
			Value = $(this).val();
			if(Value !== ''){
				$(this).closest(parentEle).addClass('completed')	
			}
		});
	},
	//callback
	masking : () => {//디자인에 따른 password 마스킹 처리시
		$('input[type="password"]').each(function(){//maxlength 만큼 마스킹 요소 생성
			length = $(this).attr('maxlength');
			$target = $(this).next('.masking')
			for(i=0; i < length; i++){
				$target.append('<span></span>'); 
			}
		});
		$(document).on('focusin , click' , 'input[type="password"]' , function(){//value 값이 있을때 커서를 제일 뒤로 보내기
			charLen = $(this).val().length;
			$(this).get(0).setSelectionRange(charLen , charLen);
		});
		$(document).on('keypress' , 'input[type="password"]' , function(){
			len = $(this).val().length
			$target = $(this).next('.masking').children('span'); //타겟 지정
			$target.eq(len).addClass('current');
		});
		$(document).on('keydown' , 'input[type="password"]' , function(e){// backspace 일때 event
			len = $(this).val().length
			e.keyCode === 8 ? $target.eq(len - 1).removeClass('current') : false; 
		});

	},
	vaildChk : (target , parentNode) => {//validation check
		$(target).each(function(){
			val = $(this).val();
			condition = ''//error 조건 
			if(val === condition){
				$(this).closest(parentNode).addClass('error');
				error.msg('에러메시지 입니다.' , $(this).closest(parentNode));
			}
		})	
	}	
}

//vaildation
let vaildChk = {
	click : (targetId) => { //클릭 이벤트로 vaildation 체크시
		$(targetId).find('input[type="checkbox"]').each(function(){
			prop = $(this).prop('checked');
			if(prop === false){
				$(this).next('label').addClass('error');
			}
		});
	}
}

//error msg
let error = {
	msg : (errTxt , appendClass) => {
		html = '<p class="error_msg">' + errTxt + '</p>';
		$(appendClass).find('.error_msg').length === 0
		? $(appendClass).append(html)
		: false;
	},
	del : (removeClass) => {
		$(removeClass).find('.error_msg').remove();
	}
}

//< , > 문자열 변경 가이드에서 pre안에 태그 넣을때 사용
let charChange = {
	init : function(){
		_this = this;
		_this.event();
	},
	event : function(){
		$('pre').each(function(){
			txt = $(this).html();
			replaceTxt = txt.replace(/</gi , '&lt;'); //정규식 모든 <요소를 &lt;로 변경
			replaceTxt = replaceTxt.replace(/>/gi , '&gt;'); //정규식 모든 >요소를 &gt;로 변경
			$(this).html(replaceTxt)
		});
		
	}
}

let graph = {
	event : (eventTarget , option) => {
		graphTarget = $('#' + eventTarget);
		total = graphTarget.find('.graph_con').attr('data-total');
		fill = graphTarget.find('.graph_fill').text();
		eachTarget = graphTarget.find('.graph_items');
		graph.action(option);


	},
	action : (options) =>{
		eachTarget.each(function(index){
			value = $(this).attr('data-value');	
			if(options.type === 'rect'){//막대 그래프 타입일때
				options.position === 'vertical' 
				? (tHeight = value / total * 100 + '%' , tWidth = 100 + 'px' , transHw = 'height') //세로형일때
				: (tHeight = 50 + 'px' , tWidth = value / total * 100 + '%' , transHw = 'width'); //가로형일때
				$(this).css({
					'width': tWidth ,
					'height' : tHeight , 
					'transition': transHw + ' .5s' , 
					'transition-delay': .2 * index + 's'
				})//transition 값은 가이드에 맞추어 조정해야함
				value / total * 100 > 100 ? $(this).addClass('excess') : false;
			} else {
				leftPos = value / total * 100 + '%';
				console.log(fill , value)
				fill >= value ? $(this).addClass('current') : console.log('456')
				value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g , ',');//3단위 콤마
				$(this).find('.price').text(value + '원');

				$(this).css({
					left : leftPos,
				});	
			}
		});
		graphTarget.find('.graph_fill').animate({'width': fill / total * 100 + '%'} , 300 , function(){
			//graph 로딩후 실행할 function;
		});
	},
	reset : () => {
		console.log(eachTarget)
	},
	canvas : (idx) => {
		const ctx = $('#' + idx).get(0).getContext('2d');
		
		ctx.fillStyle = 'rgb(255,0,0)';
		ctx.fillRect(10 , 10 , 50 , 50); // x, y , width , height;
		
		//ctx.fillStyle = "rgb(200,0,0)";
        //ctx.fillRect (10, 10, 50, 50);
		console.log(ctx)
	},
	ex : () =>{
		const canvas = document.getElementById('graph2');
		const ctx = canvas.getContext('2d');
	   
		var width = canvas.clientWidth;
		var height = canvas.clientHeight;
	
		var value = [100, 200, 300];
		var degree = 360;
		const radius = 50;
	
		var sum = value.reduce((a, b) => a + b);
		var conv_array = value.slice().map((data)=>{
			var rate = data / sum;
			var myDegree = degree * rate;
			return myDegree;
		});
	
	
		degree = 0;
		var event_array = value.slice().map( arg=> []);  //구간을 담는 배열, 이벤트시 활용한다.
		for(var i=0;i < conv_array.length;i++){
			var item = conv_array[i];
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(width/2, height/2);
			if(i == 0){ 
				ctx.arc(width/2, height/2, radius, (Math.PI/180)*0, (Math.PI/180)* item , false);
				degree = item;
				event_array[i] = [0, degree];
			} else {
				ctx.arc(width/2, height/2, radius, (Math.PI/180)*degree, (Math.PI/180)*(degree + item), false);
				event_array[i] = [degree, degree+item];
				degree =  degree + item;
			}
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
		}
		console.log(event_array);
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
	selectbox.init();
	
	graph.event('graph' , {
		type : 'rect', // circle , line
		position : 'vertical', //horizontal
	});
	graph.event('graph1' , {
		type : 'rect', // circle , line
		position : 'horizontal', //vertical
	});
	graph.event('graph2' , {
		type : 'line', // circle , line
	});
	graph.event('graph3' , {
		type : 'line', // circle , line
	});
});


