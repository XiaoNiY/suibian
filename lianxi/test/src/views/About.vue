<template>
  <div id="main_ring_Box" class="mainBox">
		<div class="mains" id="page_ring_main">
      <div class="kuyin_iframe_box">
        <div class="loading" style="display:none">
          <img class="loading_img" src="img/loading.png" width="68" height="68" alt="" />
        </div>
        <iframe id="kuyin_iframe" src="https://kyyapp.kuyinxiu.com/friend/16caaeab24cadb55" frameborder="0" scrolling="no"></iframe>
      </div>
		</div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      // src: "https://kyyapp.kuyinxiu.com/friend/16caaeab24cadb55"
    }
  }
}
</script>

<style lang="scss">
/* ====== main ======================================================================== */
.mainBox{
  // width: calc(100% - 189px);
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
  float: left;
  & > .mains {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    &::after {
      content: "";
      width: 1px;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 811px;
      background: #eee;
    }
  }
  .kuyin_iframe_box {
    width: 100%;
    height: 100%;
    display: block;
    & .loading {
      height: 100%;
      &{
        width: 809px;
        height: calc(100% - 43px);
        background: #FFF;
        position: absolute;
        top: 43px;
        z-index: 3;
      }
    }
    #kuyin_iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
  }
}

</style>