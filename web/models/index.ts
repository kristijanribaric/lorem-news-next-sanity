export interface RecievedImage {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
}

export interface Article {
  id: string;
  title: string;
  mainImage: RecievedImage;
  body?: any[];
  categories: string[];
  authorImage: RecievedImage;
  authorName: string;
  publishedAt: string;
}
