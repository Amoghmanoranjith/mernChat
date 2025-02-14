import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mernchat",
    short_name: "Mernchat",
    theme_color: "#000000",
    background_color: "#000000",
    display: "standalone",
    display_override:['window-controls-overlay'],
    scope: "/",
    orientation:"any",
    id:"/",
    start_url: "/",
    icons: [
      {
        src: "images/pwa/maskable192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "images/pwa/logo192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "images/pwa/logo256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "images/pwa/logo384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "images/pwa/logo512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    screenshots:[
      // dekstop screenshots
      {
        src:"images/dekstop-screenshots/1.png",
        form_factor:"wide",
        label:"Create Groups",
        sizes:"1920x1080",
        type:"image/png"
      },
      {
        src:"images/dekstop-screenshots/2.png",
        form_factor:"wide",
        label:"Send Polls",
        sizes:"1920x1080",
        type:"image/png"
      },
      {
        src:"images/dekstop-screenshots/3.png",
        form_factor:"wide",
        label:"Send Gif's",
        sizes:"1920x1080",
        type:"image/png"
      },
      {
        src:"images/dekstop-screenshots/4.png",
        form_factor:"wide",
        label:"Send photos, edit/unsend messages and many more..",
        sizes:"1920x1080",
        type:"image/png"
      },

      // mobile screenshots
      {
        src:"images/mobile-screenshots/1.png",
        form_factor:"narrow",
        label:"See all your chats in one place",
        sizes:"1080x1920",
        type:"image/png"
      },
      {
        src:"images/mobile-screenshots/2.png",
        form_factor:"narrow",
        label:"Send gif's, photos, polls and many more..",
        sizes:"1080x1920",
        type:"image/png"
      },
      {
        src:"images/mobile-screenshots/3.png",
        form_factor:"narrow",
        label:"edit/unsend and even react to messages",
        sizes:"1080x1920",
        type:"image/png"
      },
      {
        src:"images/mobile-screenshots/4.png",
        form_factor:"narrow",
        label:"Manage group chats effortlessly",
        sizes:"1080x1920",
        type:"image/png"
      },
    ],
  };
}
