import Banner from "@/components/home/banner";
import CategoryGrid from "@/components/home/category-grid";
import FeaturedProducts from "@/components/home/featured-products";
import SubcategoryGrid from "@/components/home/subcategory-grid";
import PageLayout from "@/components/layout/PageLayout";

// Sample data for subcategories
const lingerieCats = [
  { name: "内衣新品", count: 594, link: "/collections/lingerie-new" },
  { name: "女仆女佣", count: 79, link: "/collections/maid" },
  { name: "学生制服", count: 54, link: "/collections/student-uniform" },
  { name: "睡衣睡裙", count: 175, link: "/collections/sleepwear" },
  { name: "复古旗袍", count: 110, link: "/collections/cheongsam" },
  { name: "猫女兔女郎", count: 70, link: "/collections/bunny-cat" },
];

const vibratorCats = [
  { name: "秒潮神器", count: 22, link: "/collections/clitoral-stimulator" },
  { name: "仙女棒", count: 19, link: "/collections/vibrator-dildo" },
  { name: "跳蛋 | 穿戴 | 远程", count: 22, link: "/collections/kegel-ball" },
  { name: "仿真阳具 - 按摩阳具", count: 10, link: "/collections/dildos" },
];

const masturbatorCats = [
  { name: "自动飞机杯", count: 28, link: "/collections/auto-masturbator" },
  { name: "手动飞机杯", count: 69, link: "/collections/manual-masturbator" },
  { name: "名器倒模", count: 41, link: "/collections/torso" },
  { name: "臀模&半身倒模", count: 12, link: "/collections/half-torso" },
  { name: "飞机杯配件", count: 13, link: "/collections/masturbator-accessories" },
  { name: "后庭/前列腺按摩", count: 13, link: "/collections/anal-massage" },
];

export default function Home() {
  return (
    <PageLayout>
      {/* Banner */}
      <Banner />

      {/* Main Category Grid */}
      <CategoryGrid />

      {/* Featured Products Section - For Women */}
      <FeaturedProducts title="女生玩具" />

      {/* Subcategory Grid - Lingerie */}
      <SubcategoryGrid
        title="情趣内衣"
        categories={lingerieCats}
      />

      {/* Subcategory Grid - Vibrators */}
      <SubcategoryGrid
        title="按摩棒"
        categories={vibratorCats}
      />

      {/* Featured Products Section - For Men */}
      <FeaturedProducts title="男生玩具" />

      {/* Subcategory Grid - Masturbators */}
      <SubcategoryGrid
        title="飞机杯 | 丝袜 | 内裤 | 配件"
        categories={masturbatorCats}
      />
    </PageLayout>
  );
}
