// ==UserScript==
// @name        tradingview自动填写
// @namespace   Violentmonkey Scripts
// @match       https://cn.tradingview.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/3/26 14:57:44
// ==/UserScript==

// alt+Z 自动填写

var reactFiber='';


//获取React的Fiber
function getReactFiber(){
  let reactFiber_dom = document.querySelector(".content-tBgV1m0B");
  let reactFiber_keys = Object.keys(reactFiber_dom);
  for (const i in reactFiber_keys){
    if (reactFiber_keys[i].startsWith('__reactFiber$')) {
      reactFiber = reactFiber_dom[reactFiber_keys[i]];
      return;
    }
  }
}

window.onkeydown = function (event) {
  if(event.altKey && event.keyCode == 90){
    getReactFiber();
    let ticks = '';
    // 获取收盘价div
    let close = document.evaluate("/html/body/div[2]/div[5]/div[1]/div[1]/div/div[2]/div[1]/div[2]/div/div[2]/div[1]/div[1]/div[2]/div/div[5]/div[2]",document.body).iterateNext();
    // 获取最低价div
    let low = document.evaluate("/html/body/div[2]/div[5]/div[1]/div[1]/div/div[2]/div[1]/div[2]/div/div[2]/div[1]/div[1]/div[2]/div/div[4]/div[2]",document.body).iterateNext();
    // 获取最高价div
    let high = document.evaluate("/html/body/div[2]/div[5]/div[1]/div[1]/div/div[2]/div[1]/div[2]/div/div[2]/div[1]/div[1]/div[2]/div/div[3]/div[2]",document.body).iterateNext();
    // 获取做多的ATR计算后的div
    let lowPlusAtr = document.evaluate("/html/body/div[2]/div[5]/div[1]/div[1]/div/div[2]/div[3]/div[2]/div/div[2]/div/div/div[2]/div[2]/div/div[1]/div",document.body).iterateNext();
    // 获取空多的ATR计算后的div
    let highMinusAtr = document.evaluate("/html/body/div[2]/div[5]/div[1]/div[1]/div/div[2]/div[3]/div[2]/div/div[2]/div/div/div[2]/div[2]/div/div[2]/div",document.body).iterateNext();
    // 获取3.6倍ATR
    let Atr = document.evaluate("/html/body/div[2]/div[5]/div[1]/div[1]/div/div[2]/div[5]/div[2]/div/div[2]/div/div/div[2]/div[2]/div/div[2]/div",document.body).iterateNext();
    // 获取当前光标所在元素
    let activeElement = document.activeElement;

    switch(activeElement.getAttribute('data-property-id')) {
      case 'Risk/RewardlongEntryPrice':
       // 设置开仓价
        reactFiber.memoizedProps.children[0].props.definition.definitions._value[3].properties.value.setValue(parseFloat(close.innerHTML));
        break;
      case 'Risk/RewardshortEntryPrice':
        // 设置开仓价
        reactFiber.memoizedProps.children[0].props.definition.definitions._value[3].properties.value.setValue(parseFloat(close.innerHTML));
        break;

      case 'Risk/RewardlongStopLevelPrice':
        // 设置止损价
        reactFiber.memoizedProps.children[2].props.definition.definitions._value[1].properties.value.setValue(parseFloat(low.innerHTML));
        // 让1个点
        ticks = reactFiber.memoizedProps.children[2].props.definition.definitions._value[0].properties.value.value();
        reactFiber.memoizedProps.children[2].props.definition.definitions._value[0].properties.value.setValue(ticks+10);
        break;
      case 'Risk/RewardshortStopLevelPrice':
        // 设置止损价
        reactFiber.memoizedProps.children[2].props.definition.definitions._value[1].properties.value.setValue(parseFloat(high.innerHTML));
        // 让1个点
        ticks = reactFiber.memoizedProps.children[2].props.definition.definitions._value[0].properties.value.value();
        reactFiber.memoizedProps.children[2].props.definition.definitions._value[0].properties.value.setValue(ticks+10);
        break;

      case 'Risk/RewardlongProfitLevelPrice':
        // 设置止盈价
        console.log(lowPlusAtr)
        console.log(lowPlusAtr.innerHTML)
        reactFiber.memoizedProps.children[1].props.definition.definitions._value[1].properties.value.setValue(parseFloat(lowPlusAtr.innerHTML));
        break;
      case 'Risk/RewardshortProfitLevelPrice':
        // 设置止盈价
        reactFiber.memoizedProps.children[1].props.definition.definitions._value[1].properties.value.setValue(parseFloat(highMinusAtr.innerHTML));
        break;

      default:
        break;
    }
    if(activeElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('data-dialog-name')=="获取止盈"){
      // 设置3.6倍ATR
      atrNum=parseFloat(Atr.innerHTML.replace(/\s/g,""))
      reactFiber.memoizedProps.children[0].props.property.in_0._listeners._listeners[0].object.in_0._listeners._listeners[1].object._setValue("in_0",atrNum,"ATRx3.6")
    }
  }
}
