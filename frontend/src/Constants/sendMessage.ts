const imageTypes = ['image/png', 'image/jpg', 'image/x-icon'];
const videoTypes = ['video/mp4', ];
const audioTypes = ['audio/mpeg', ];
const textTypes = ['application/pdf', 'text/plain'];

const ACCEPTEDFILETYPES = [...imageTypes, ...videoTypes, ...audioTypes, ...textTypes];
const ACCEPTEDFILEMAXSIZE = 10485760;

export {ACCEPTEDFILETYPES, ACCEPTEDFILEMAXSIZE};
export {imageTypes, videoTypes, audioTypes, textTypes};