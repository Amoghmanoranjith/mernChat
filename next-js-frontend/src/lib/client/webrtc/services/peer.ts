class PeerService {
    public peer: RTCPeerConnection | null = null;
  
    constructor() {
      try {
        if (!this.peer) {
          this.peer = new RTCPeerConnection({
            iceServers: [
              {
                urls: [
                  "stun:stun.l.google.com:19302",
                  "stun:global.stun.twilio.com:3478",
                ],
              },
            ],
          });
        }
      } catch (error) {
        console.log('Error in PeerService constructor', error);
      }
    }

    private ensurePeerConnection() {
      if (!this.peer || this.peer.signalingState === "closed") {
          this.peer = new RTCPeerConnection({
              iceServers: [
                  {
                      urls: [
                          "stun:stun.l.google.com:19302",
                          "stun:global.stun.twilio.com:3478",
                      ],
                  },
              ],
          });
      }
  }
  
    async getAnswer(offer: RTCSessionDescriptionInit) {
      try {
        this.ensurePeerConnection();
        if (this.peer) {
          await this.peer.setRemoteDescription(offer);
          const ans = await this.peer.createAnswer();
          await this.peer.setLocalDescription(new RTCSessionDescription(ans));
          return ans;
        }
      } catch (error) {
        console.log('Error in getAnswer', error);
      }
    }
  
    async setLocalDescription(ans: RTCSessionDescriptionInit) {
      try {
        this.ensurePeerConnection();
        if (this.peer) {
          await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
      } catch (error) {
        console.log('Error in setLocalDescription', error);
      }
    }
  
    async getOffer() {
      try {
        this.ensurePeerConnection();
        if (this.peer) {
          const offer = await this.peer.createOffer();
          await this.peer.setLocalDescription(new RTCSessionDescription(offer));
          return offer;
        }
      } catch (error) {
        console.log('Error in getOffer', error);
      }
    }

    closeConnection() {
      if (this.peer) {
          this.peer.close();
          this.peer = null;
      }
    }
  }
  
  export const peer = new PeerService();
  