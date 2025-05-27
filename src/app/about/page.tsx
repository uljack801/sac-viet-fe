"use client"
import Image from "next/image";
export default function About() {
  return (
    <div className="text-[var(--color-text-root)] py-28 mt-20 2xl:mx-80 xl:mx-40">
      <p className="flex justify-center items-center text-4xl font-bold mb-10 xl:text-3xl">Ý nghĩa về logo Sắc Việt</p>
      <div className="flex justify-center items-center pb-4">
        <div>
          <Image src="/logo_big.png" alt="logo" width={480} height={480} />
        </div>
        <div className="xl:text-sm">
          <p>Logo của <strong>Sắc Việt </strong>được thiết kế tinh tế với ý nghĩa sâu sắc, thể hiện rõ bản sắc văn hóa và giá trị của thương hiệu. Dưới đây là phân tích chi tiết:</p>
          <p className="font-medium">1. Hình dáng cô gái – Biểu tượng của bản sắc Việt</p>
          <ul className="list-disc ml-10">
            <li><strong>Tóc của cô gái tạo thành chữ &quot;S&quot;</strong>, đồng thời mô phỏng hình dáng bản đồ Việt Nam. Điều này tượng trưng cho <strong>tinh thần dân tộc</strong>, sự kết nối với văn hóa và nghề thủ công truyền thống Việt Nam.</li>
            <li><strong>Nón lá </strong> là hình ảnh đặc trưng của người Việt, đặc biệt là những người thợ thủ công ở làng nghề. Nó đại diện cho sự mộc mạc, tinh tế và giá trị truyền thống mà thương hiệu muốn tôn vinh.</li>
          </ul>
          <p className="font-medium">2. Sự kết hợp của chữ &quot;S&quot; và &quot;V&quot;</p>
          <ul className="list-disc ml-10">
            <li>Chữ &quot;S&quot; thể hiện từ &quot;Sắc&quot;, mang ý nghĩa về màu sắc, sự đa dạng của các sản phẩm thủ công mỹ nghệ.</li>
            <li>Chữ &quot;V&quot; có thể tượng trưng cho &quot;Việt&quot;, nhấn mạnh yếu tố truyền thống và nguồn gốc của sản phẩm</li>
            <li>Khi ghép lại, &quot;S&quot; và &quot;V&quot; tạo thành &quot;Sắc Việt&quot;, tên thương hiệu, thể hiện rõ thông điệp về một nền tảng <strong>kết nối nghệ nhân Việt với khách hàng </strong>yêu thích sản phẩm thủ công mỹ nghệ.</li>
          </ul>
        </div>
      </div>
      <div className="bg-[url(/article_art.png)] bg-cover bg-center aspect-video my-4 rounded-sm">
        <p className="flex justify-center items-center text-white text-5xl font-bold h-full">Kết nối tinh hoa hàng Việt</p>
      </div>
      <p className="text-4xl font-bold my-10 xl:text-3xl">Tầm nhìn & Sứ mệnh</p>
      <div className="grid grid-cols-2 gap-4 xl:text-sm">
        <p className="col-span-1 bg-white p-4 rounded-xl"><strong>Tầm nhìn:</strong> Trở thành sàn TMĐT uy tín nhất về thủ công mỹ nghệ Việt, tôn vinh văn hóa truyền thống qua công nghệ, kết nối nghệ nhân với khách hàng toàn cầu.</p>
        <p className="col-span-1  bg-white p-4 rounded-xl"><strong>Sứ mệnh:</strong> Với khát vọng tạo dựng một hệ sinh thái số hóa toàn diện cho ngành thủ công mỹ nghệ Việt Nam, giúp mỗi sản phẩm không chỉ là một món hàng mà còn là một câu chuyện văn hóa, một tác phẩm nghệ thuật mang đậm hồn Việt. Xây dựng hệ sinh thái số cho ngành thủ công mỹ nghệ, mang đến trải nghiệm mua sắm tiện lợi, hỗ trợ nghệ nhân mở rộng thị trường, kết nối cộng đồng yêu đồ thủ công và ứng dụng AI để nâng cao trải nghiệm.</p>
      </div>

    </div>
  );
}
