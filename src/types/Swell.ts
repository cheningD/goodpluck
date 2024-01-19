interface Category {
  name: string;
  active: boolean;
  sorting: null;
  images: [
    {
      file: {
        id: string;
        date_uploaded: string;
        length: number;
        md5: string;
        filename: null;
        content_type: string;
        metadata: null;
        url: string;
        width: number;
        height: number;
      };
      id: string;
    },
  ];
  description: string;
  meta_title: string;
  meta_description: string;
  parent_id: string;
  slug: string;
  top_id: string;
  date_created: string;
  date_updated: string;
  sort: number;
  id: string;
}

export type { Category };
