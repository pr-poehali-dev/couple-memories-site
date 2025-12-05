import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [activeSection, setActiveSection] = useState<"home" | "moments">("home");

  const moments = [
    {
      id: 1,
      title: "Первая встреча",
      date: "14 февраля 2023",
      description: "День, когда наши сердца встретились...",
      image: "https://cdn.poehali.dev/projects/e40605ee-62aa-45c2-8830-c9a2a736e37a/files/101a60e7-03ec-4926-ac6e-b5ae9fb1bdaf.jpg"
    },
    {
      id: 2,
      title: "Наше первое путешествие",
      date: "15 июня 2023",
      description: "Незабываемые моменты вместе в новом городе",
      image: "https://cdn.poehali.dev/projects/e40605ee-62aa-45c2-8830-c9a2a736e37a/files/75318097-aeb7-4126-9eeb-5083de9a3635.jpg"
    },
    {
      id: 3,
      title: "Уютный вечер вдвоем",
      date: "22 августа 2023",
      description: "Простые моменты, которые создают большие воспоминания",
      image: "https://cdn.poehali.dev/projects/e40605ee-62aa-45c2-8830-c9a2a736e37a/files/d007a8e8-6639-4221-a3f6-aeaa942f2867.jpg"
    }
  ];

  const floatingHearts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    duration: `${3 + Math.random() * 2}s`
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-romantic-pink via-background to-romantic-purple overflow-hidden relative">
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-romantic-rose opacity-20 animate-float pointer-events-none"
          style={{
            left: heart.left,
            bottom: '-50px',
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            fontSize: `${20 + Math.random() * 20}px`
          }}
        >
          ❤
        </div>
      ))}

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-romantic-purple/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Наша История ❤</h1>
          <div className="flex gap-4">
            <Button
              variant={activeSection === "home" ? "default" : "ghost"}
              onClick={() => setActiveSection("home")}
              className="hover-scale"
            >
              <Icon name="Home" className="mr-2" size={20} />
              Главная
            </Button>
            <Button
              variant={activeSection === "moments" ? "default" : "ghost"}
              onClick={() => setActiveSection("moments")}
              className="hover-scale"
            >
              <Icon name="Heart" className="mr-2" size={20} />
              Моменты
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-12">
        {activeSection === "home" && (
          <div className="animate-fade-in">
            <section className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
              <div className="animate-scale-in">
                <h2 className="text-7xl md:text-8xl font-bold text-primary mb-6">
                  Наша Любовь
                </h2>
                <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  История двух сердец, которые нашли друг друга в этом огромном мире
                </p>
              </div>
              
              <div className="flex gap-6 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 hover-scale"
                  onClick={() => setActiveSection("moments")}
                >
                  Посмотреть наши моменты
                  <Icon name="ArrowRight" className="ml-2" size={24} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl">
                <Card className="p-8 bg-white/60 backdrop-blur-sm border-romantic-purple/30 hover-scale">
                  <div className="text-5xl mb-4">💑</div>
                  <h3 className="text-2xl font-semibold mb-2">Вместе</h3>
                  <p className="text-muted-foreground">Каждый день - новое приключение</p>
                </Card>
                <Card className="p-8 bg-white/60 backdrop-blur-sm border-romantic-peach/30 hover-scale">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="text-2xl font-semibold mb-2">Моменты</h3>
                  <p className="text-muted-foreground">Воспоминания на всю жизнь</p>
                </Card>
                <Card className="p-8 bg-white/60 backdrop-blur-sm border-romantic-rose/30 hover-scale">
                  <div className="text-5xl mb-4">💝</div>
                  <h3 className="text-2xl font-semibold mb-2">Любовь</h3>
                  <p className="text-muted-foreground">Навсегда и всегда</p>
                </Card>
              </div>
            </section>
          </div>
        )}

        {activeSection === "moments" && (
          <div className="animate-fade-in">
            <section className="py-12">
              <h2 className="text-6xl font-bold text-center mb-4 text-primary">
                Наши Моменты
              </h2>
              <p className="text-center text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
                Каждое мгновение с тобой — это драгоценный камень в короне наших воспоминаний
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {moments.map((moment, index) => (
                  <Card
                    key={moment.id}
                    className="overflow-hidden hover-scale bg-white/70 backdrop-blur-sm border-romantic-purple/20 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={moment.image}
                        alt={moment.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-romantic-rose/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                        {moment.date}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3 text-primary flex items-center gap-2">
                        <Icon name="Heart" size={24} className="text-romantic-rose" />
                        {moment.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {moment.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-16 text-center">
                <Card className="inline-block p-8 bg-gradient-to-r from-romantic-pink to-romantic-purple border-none">
                  <p className="text-2xl font-semibold text-primary italic">
                    "Самые лучшие моменты жизни - это те, которыми мы делимся с любимыми"
                  </p>
                </Card>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="bg-white/50 backdrop-blur-md border-t border-romantic-purple/20 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            Создано с
            <Icon name="Heart" size={20} className="text-romantic-rose animate-pulse" />
            для моей второй половинки
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
