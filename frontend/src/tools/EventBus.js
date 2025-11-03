const EventBus = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  dispatch(event, data) {
    const eventDetail = new CustomEvent(event, { detail: data });
    document.dispatchEvent(eventDetail);
  },
  remove(event, callback) {
    document.removeEventListener(event, callback);
  },
};

export default EventBus;