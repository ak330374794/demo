<script>
  import Swiper from '../assets/js/swiper/swiper.min.js'

  let galleryTop
  let galleryThumbs
  export default {
    data() {
      return {
        Index: {
          bgimg: [
            {
              'imgs': '../src/assets/img/test1.jpg'
            }, {
              'imgs': '../src/assets/img/test2.jpg'
            }, {
              'imgs': '../src/assets/img/test3.jpg'
            }, {
              'imgs': '../src/assets/img/test4.jpg'
            }, {
              'imgs': '../src/assets/img/test5.jpg'
            }, {
              'imgs': '../src/assets/img/test6.jpg'
            }
          ],
          siteInfo: {
            sitename: "这是一个标题"
          }
        },
      }

    },
    created: function () {
      this.$nextTick(function () {
        this.lunbo();
        console.log(987987);
      });
      console.log(345345);
    },
    methods: {
      goBack: function (e) {
        history.go(-1);
      },
      goList: function () {
        console.log("goList");
      },
      lunbo: function () {
        console.log(5643);
        galleryTop = new Swiper('.gallery-top', {
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          spaceBetween: 10,
          grabCursor: true,
          initialSlide: 0,
          preventClicks: false,
          autoplayDisableOnInteraction: false
        });
        /*galleryThumbs = new Swiper('.gallery-thumbs', {
          spaceBetween: 10,
          autoplay: 4000,
          initialSlide: 0,
          centeredSlides: true,
          slidesPerView: 'auto',
          touchRatio: 0.2,
          slideToClickedSlide: true,
          autoplayDisableOnInteraction: false,
          grabCursor: true
        });*/
        galleryTop.params.control = galleryThumbs
        //galleryThumbs.params.control = galleryTop
      }
    }
  }
</script>
<template>
  <header class="header mui-bar mui-bar-nav">
    <h1 id="title" class="mui-title">{{Index.siteInfo.sitename}}</h1>
  </header>
  <div class="mui-content index-page">
    <div class="swiper-container gallery-top swiper-container-horizontal">
      <div class="swiper-wrapper">
        <div  @click="goList" v-link="{ path: '/list' }" v-for="value in Index.bgimg"
              class="swiper-slide swiper-slide-next"
             style="width: 100%; margin-right: 10px;"
             v-bind:style="{backgroundImage: 'url(' + value.imgs + ')'}"></div>
      </div>
      <div class="swiper-button-next swiper-button-white"></div>
      <div class="swiper-button-prev swiper-button-white swiper-button-disabled"></div>
    </div>
    <!--<div class="swiper-container gallery-thumbs swiper-container-horizontal">
      <div class="swiper-wrapper">
        <div v-for="value in Index.bgimg" class="swiper-slide swiper-slide-next" style="margin-right: 10px;"
             v-bind:style="{backgroundImage: 'url(' + value.imgs + ')'}"></div>
      </div>
    </div>-->
  </div>
</template>
<style>
  @import url("../assets/css/swiper.min.css");

  .gallery-top {
    height: 100%;
    width: 100%;
  }

  .gallery-thumbs {
    height: 20%;
    box-sizing: border-box;
    padding: 10px 0;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }

  .gallery-thumbs .swiper-slide {
    width: 30%;
    height: 6rem;
    opacity: 0.3;
  }

  .gallery-thumbs .swiper-slide-active {
    opacity: 1;
  }

  .swiper-slide {
    background-size: 100% 160%;
    -webkit-background-size: 100% 160%;
  }
</style>
