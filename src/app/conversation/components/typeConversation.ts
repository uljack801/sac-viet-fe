export type ConversationProps = {
  data: [
    {
      _id: string;
      user: string;
      name: string;
      image: [string];
      content: string;
      likes: [
        {
          user: string;
        }
      ];
      comments: [
        {
          _id: string;
          user: string;
          name: string;
          comment: string;
          image: [string];
          createdAt: Date;
          status: boolean;
          likes: [
            {
              user: string;
            }
          ];
          isEdit: boolean;
          reply: [
            {
              _id: string;
              user: string;
              name: string;
              comment: string;
              image: [string];
              createdAt: Date;
              likes: [
                {
                  user: string;
                }
              ];
              status: boolean;
              isEdit: boolean;
            }
          ];
        }
      ];
      isEdit: boolean;
      status: boolean;
      createdAt: Date;
      updateAt: Date;
    }
  ];
  message: string;
};
