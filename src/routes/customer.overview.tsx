import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Droplets,
  Smartphone,
  Zap,
  Gift,
  PlayCircle
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCarwashStore } from "@/lib/carwash-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customer/overview")({
  component: () => <OverviewPage />,
});

export function OverviewPage() {
  const { isAuthenticated, role } = useCarwashStore();
  
  return (
    <div className="w-full bg-background animate-in fade-in duration-700">
      
      {/* 1. Hero Section */}
      <section className="relative w-full overflow-hidden border-b border-border/50 bg-card/30 pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/5 rounded-bl-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10 grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> Chăm Sóc Xe Thông Minh
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Trải Nghiệm Rửa Xe <span className="text-primary">Đẳng Cấp</span> & <span className="text-primary">Tự Động</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Hệ thống rửa xe tự động hàng đầu với công nghệ bọt tuyết siêu vi, nhận diện biển số thông minh và quản lý lịch hẹn tiện lợi ngay trên điện thoại của bạn.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button asChild size="lg" className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                <Link to="/customer/bookings/new">
                  Đặt Lịch Ngay <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl font-bold border-border/60 hover:bg-accent/50 transition-all">
                <PlayCircle className="mr-2 h-5 w-5" /> Xem Video
              </Button>
            </div>
          </div>
          
          <div className="relative">
            {/* Visual Placeholder for Car Wash Video/Image */}
            <div className="aspect-video rounded-3xl overflow-hidden border border-border/50 shadow-2xl relative bg-muted/20 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50 z-10 pointer-events-none" />
              <img 
                src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop" 
                alt="Premium Car Wash" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />
              <Button size="icon" className="h-16 w-16 rounded-full bg-primary/90 text-primary-foreground shadow-xl backdrop-blur-md hover:scale-110 transition-transform relative z-20">
                <PlayCircle className="h-8 w-8" />
              </Button>
            </div>
            
            {/* Floating Badges */}
            <Card className="absolute -bottom-6 -left-6 border-border/50 bg-background/80 backdrop-blur-xl shadow-xl p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold text-foreground">100% Tự Động</div>
                <div className="text-xs text-muted-foreground">Không làm xước sơn</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. How It Works */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Cách Thức Hoạt Động</h2>
            <p className="text-muted-foreground">Quy trình rửa xe thông minh được tối ưu hóa để tiết kiệm tối đa thời gian của bạn.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard 
              number="01"
              icon={Smartphone}
              title="Đặt Lịch Nhanh Chóng"
              description="Chọn dịch vụ và khung giờ qua ứng dụng. Hệ thống tự động ghi nhận biển số xe của bạn."
            />
            <StepCard 
              number="02"
              icon={Zap}
              title="Check-in Tự Động"
              description="Đến trạm, camera nhận diện biển số và mở barie tự động. Không cần xuống xe."
            />
            <StepCard 
              number="03"
              icon={Droplets}
              title="Rửa Xe & Theo Dõi"
              description="Tận hưởng dịch vụ tại phòng chờ VIP và theo dõi tiến độ rửa xe real-time trên điện thoại."
            />
          </div>
        </div>
      </section>

      {/* 3. Services & Pricing */}
      <section className="py-24 bg-accent/10 border-y border-border/50 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Dịch Vụ & Bảng Giá</h2>
            <p className="text-muted-foreground">Các gói dịch vụ được thiết kế phù hợp với mọi nhu cầu chăm sóc xế yêu của bạn.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard 
              title="Basic Wash"
              price="80,000₫"
              description="Rửa xe tiêu chuẩn hàng ngày"
              features={["Rửa thân xe tự động", "Xịt gầm cơ bản", "Sấy khô bằng gió", "Lau dọn nội thất cơ bản"]}
            />
            <PricingCard 
              title="Premium Polish"
              price="150,000₫"
              description="Làm sạch sâu và bảo vệ lớp sơn"
              features={["Mọi dịch vụ của gói Basic", "Phủ sáp bảo vệ sơn (Wax)", "Vệ sinh lazang chuyên sâu", "Khử mùi nội thất"]}
              isPopular
            />
            <PricingCard 
              title="Ultimate Care"
              price="300,000₫"
              description="Chăm sóc toàn diện từ trong ra ngoài"
              features={["Mọi dịch vụ của gói Premium", "Phủ Ceramic bảo vệ 30 ngày", "Vệ sinh khoang máy", "Dưỡng nhựa & ghế da cao cấp"]}
            />
          </div>
        </div>
      </section>

      {/* 4. Loyalty Program */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl relative">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
            <div className="grid md:grid-cols-2 items-center p-8 md:p-12 gap-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                  <Gift className="h-4 w-4" /> AURA Rewards
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  Chương Trình Khách Hàng Thân Thiết
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Trở thành viên ngay hôm nay để tích lũy điểm thưởng sau mỗi lần rửa xe. Thăng hạng thẻ để nhận voucher giảm giá lên đến 30% và trải nghiệm các dịch vụ miễn phí.
                </p>
                <div className="flex gap-4 items-center pt-2">
                  <div className="text-center p-4 rounded-xl bg-background/50 border border-border/50">
                    <div className="text-2xl font-bold text-primary">Bronze</div>
                    <div className="text-xs text-muted-foreground mt-1">Hạng Cơ Bản</div>
                  </div>
                  <ArrowRight className="text-muted-foreground w-4 h-4" />
                  <div className="text-center p-4 rounded-xl bg-background/50 border border-border/50 shadow-[0_0_15px_rgba(255,215,0,0.15)] border-amber-500/20">
                    <div className="text-2xl font-bold text-amber-500">Gold</div>
                    <div className="text-xs text-muted-foreground mt-1">Giảm 10%</div>
                  </div>
                  <ArrowRight className="text-muted-foreground w-4 h-4 hidden sm:block" />
                  <div className="text-center p-4 rounded-xl bg-background/50 border border-border/50 shadow-[0_0_15px_rgba(229,228,226,0.15)] border-slate-300/20 hidden sm:block">
                    <div className="text-2xl font-bold text-slate-300">Platinum</div>
                    <div className="text-xs text-muted-foreground mt-1">Giảm 20%</div>
                  </div>
                </div>
                <Button asChild size="lg" className="mt-4 rounded-xl font-bold">
                  <Link to="/customer/loyalty">Xem Chi Tiết Đặc Quyền</Link>
                </Button>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1974&auto=format&fit=crop" 
                  alt="Luxury Car" 
                  className="rounded-2xl shadow-2xl object-cover h-[400px] w-full"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-24 bg-accent/5 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Đánh Giá Từ Khách Hàng</h2>
            <p className="text-muted-foreground">Hàng ngàn khách hàng đã trải nghiệm và hài lòng với dịch vụ rửa xe thông minh của chúng tôi.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard 
              name="Nguyễn Hữu Trí"
              role="Doanh nhân"
              content="Cực kỳ ấn tượng với công nghệ nhận diện biển số tự động. Tôi không cần phải xuống xe, mọi thứ diễn ra rất nhanh chóng và chuyên nghiệp."
            />
            <TestimonialCard 
              name="Trần Thu Hà"
              role="Nhân viên văn phòng"
              content="Việc đặt lịch qua app giúp tôi tiết kiệm được rất nhiều thời gian chờ đợi. Rất thích gói Premium, xe sạch bong và thơm tho."
            />
            <TestimonialCard 
              name="Lê Hoàng Hải"
              role="Tài xế công nghệ"
              content="Chương trình thành viên rất tốt, tôi rửa thường xuyên nên tiết kiệm được kha khá chi phí. Đội ngũ nhân viên thân thiện, nhiệt tình."
            />
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-card border-t border-border/50 pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Sparkles className="h-6 w-6 text-primary" />
                AURA CAR CARE
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hệ thống chăm sóc xe thông minh hàng đầu Việt Nam. Nhanh chóng, tiện lợi và tự động hoàn toàn.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Liên Kết Nhanh</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/customer/bookings/new" className="hover:text-primary transition-colors">Đặt lịch rửa xe</Link></li>
                <li><Link to="/customer/overview" className="hover:text-primary transition-colors">Trang chủ</Link></li>
                <li><Link to="/customer/loyalty" className="hover:text-primary transition-colors">Chương trình thành viên</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Giờ Hoạt Động</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center justify-between">
                  <span>Thứ 2 - Thứ 6</span>
                  <span className="font-medium text-foreground">07:00 - 20:00</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Thứ 7 - CN</span>
                  <span className="font-medium text-foreground">08:00 - 22:00</span>
                </li>
                <li className="flex items-center justify-between mt-4 text-emerald-500 font-medium">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Đang mở cửa</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Liên Hệ</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Khu Công Nghệ Cao, Quận 9, TP. Hồ Chí Minh</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>1900 1234</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>support@auracarcare.vn</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>© 2026 AURA CAR CARE. All rights reserved.</div>
            <div className="flex gap-4">
              <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function StepCard({ number, icon: Icon, title, description }: { number: string; icon: any; title: string; description: string }) {
  return (
    <div className="relative group p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/80 transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      <div className="absolute -right-4 -top-4 text-8xl font-black text-muted/10 transition-transform group-hover:scale-110 group-hover:text-primary/5">{number}</div>
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({ title, price, description, features, isPopular }: { title: string; price: string; description: string; features: string[]; isPopular?: boolean }) {
  return (
    <Card className={cn(
      "relative flex flex-col overflow-hidden border-border/50 bg-card/60 p-8 backdrop-blur-xl transition-all hover:shadow-xl hover:-translate-y-1",
      isPopular && "border-primary/50 shadow-lg shadow-primary/10"
    )}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-bl-lg">
          Best Seller
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mb-8">
        <span className="text-4xl font-extrabold text-foreground">{price}</span>
        <span className="text-muted-foreground">/lần</span>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button variant={isPopular ? "default" : "outline"} className={cn("w-full h-11 rounded-xl font-bold", isPopular && "shadow-md shadow-primary/20")}>
        Chọn Gói Này
      </Button>
    </Card>
  );
}

function TestimonialCard({ name, role, content }: { name: string; role: string; content: string }) {
  return (
    <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-sm">
      <div className="flex gap-1 text-amber-500 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-4 h-4 fill-current" />
        ))}
      </div>
      <p className="text-sm text-foreground leading-relaxed mb-6 italic">"{content}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-sm text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
    </Card>
  );
}
