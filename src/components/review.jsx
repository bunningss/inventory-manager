import { RatingStars } from "./rating-stars";

export function Review() {
  return (
    <article className="rounded-md bg-accent p-2 flex flex-col gap-2">
      <div>
        <span className="font-bold text-base capitalize">John favreua</span>
        <RatingStars />
      </div>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni excepturi
        quas inventore recusandae? Eius magni nihil, odio neque illo veritatis.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia neque
        nostrum dolore consectetur voluptate ipsa doloribus eaque temporibus?
        Earum, nesciunt? Lorem ipsum dolor, sit amet consectetur adipisicing
        elit. Esse aspernatur provident magnam beatae labore iure voluptate
        doloribus dolore id? Cum.
      </p>
    </article>
  );
}
