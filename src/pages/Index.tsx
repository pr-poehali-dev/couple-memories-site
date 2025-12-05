import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Moment {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<"home" | "moments">("home");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [momentToDelete, setMomentToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", date: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const [moments, setMoments] = useState<Moment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'https://functions.poehali.dev/db63cbe7-26c1-4dcf-843b-dd00bf48934c';

  useEffect(() => {
    loadMoments();
  }, []);

  const loadMoments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setMoments(data);
      }
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить моменты",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const floatingHearts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    duration: `${3 + Math.random() * 2}s`
  }));

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", date: "", description: "" });
    setImageFile(null);
    setImagePreview(null);
    setSelectedMoment(null);
  };

  const handleAddMoment = async () => {
    if (!formData.title || !formData.date || !formData.description) {
      toast({
        title: "Заполните все поля",
        description: "Пожалуйста, введите название, дату и описание момента",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          date: formData.date,
          description: formData.description,
          image: imagePreview || "https://cdn.poehali.dev/projects/e40605ee-62aa-45c2-8830-c9a2a736e37a/files/101a60e7-03ec-4926-ac6e-b5ae9fb1bdaf.jpg"
        })
      });

      if (response.ok) {
        await loadMoments();
        resetForm();
        setIsAddDialogOpen(false);
        
        toast({
          title: "Момент добавлен! 💕",
          description: "Ваше воспоминание сохранено"
        });
      } else {
        throw new Error('Failed to add moment');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить момент",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (moment: Moment) => {
    setSelectedMoment(moment);
    setFormData({
      title: moment.title,
      date: moment.date,
      description: moment.description
    });
    setImagePreview(moment.image);
    setIsEditDialogOpen(true);
  };

  const handleEditMoment = async () => {
    if (!selectedMoment) return;

    if (!formData.title || !formData.date || !formData.description) {
      toast({
        title: "Заполните все поля",
        description: "Пожалуйста, введите название, дату и описание момента",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${selectedMoment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          date: formData.date,
          description: formData.description,
          image: imagePreview || selectedMoment.image
        })
      });

      if (response.ok) {
        await loadMoments();
        resetForm();
        setIsEditDialogOpen(false);

        toast({
          title: "Момент обновлен! ✨",
          description: "Изменения сохранены"
        });
      } else {
        throw new Error('Failed to update moment');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить момент",
        variant: "destructive"
      });
    }
  };

  const openDeleteDialog = (momentId: number) => {
    setMomentToDelete(momentId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMoment = async () => {
    if (momentToDelete === null) return;

    try {
      const response = await fetch(`${API_URL}/${momentToDelete}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadMoments();
        setMomentToDelete(null);
        setIsDeleteDialogOpen(false);

        toast({
          title: "Момент удален",
          description: "Воспоминание удалено из коллекции"
        });
      } else {
        throw new Error('Failed to delete moment');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить момент",
        variant: "destructive"
      });
    }
  };

  const MomentForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-medium">
          Название момента
        </Label>
        <Input
          id="title"
          placeholder="Например: Первое свидание"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border-romantic-purple/30"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date" className="text-base font-medium">
          Дата
        </Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border-romantic-purple/30"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-medium">
          Описание
        </Label>
        <Textarea
          id="description"
          placeholder="Опишите этот особенный момент..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border-romantic-purple/30 min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image" className="text-base font-medium">
          Фотография
        </Label>
        <div className="flex flex-col gap-4">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border-romantic-purple/30"
          />
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-romantic-purple/30">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
      <Button
        onClick={onSubmit}
        className="w-full text-lg py-6 hover-scale"
      >
        <Icon name="Heart" className="mr-2" size={20} />
        {submitText}
      </Button>
    </div>
  );

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
              <p className="text-center text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Каждое мгновение с тобой — это драгоценный камень в короне наших воспоминаний
              </p>

              <div className="flex justify-center mb-12">
                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="hover-scale">
                      <Icon name="Plus" className="mr-2" size={20} />
                      Добавить момент
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-md">
                    <DialogHeader>
                      <DialogTitle className="text-3xl text-primary flex items-center gap-2">
                        <Icon name="Sparkles" size={28} className="text-romantic-rose" />
                        Новый момент
                      </DialogTitle>
                    </DialogHeader>
                    <MomentForm onSubmit={handleAddMoment} submitText="Сохранить момент" />
                  </DialogContent>
                </Dialog>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center space-y-4">
                    <div className="animate-spin text-6xl">💕</div>
                    <p className="text-xl text-muted-foreground">Загружаем ваши моменты...</p>
                  </div>
                </div>
              ) : moments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💝</div>
                  <p className="text-xl text-muted-foreground">Пока нет добавленных моментов</p>
                  <p className="text-muted-foreground mt-2">Нажмите "Добавить момент" чтобы создать первое воспоминание</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {moments.map((moment, index) => (
                  <Card
                    key={moment.id}
                    className="overflow-hidden hover-scale bg-white/70 backdrop-blur-sm border-romantic-purple/20 animate-scale-in relative group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                        onClick={() => openEditDialog(moment)}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-destructive"
                        onClick={() => openDeleteDialog(moment.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={moment.image}
                        alt={moment.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute bottom-4 right-4 bg-romantic-rose/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                        {formatDateForDisplay(moment.date)}
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
              )}

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

      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-3xl text-primary flex items-center gap-2">
              <Icon name="Pencil" size={28} className="text-romantic-rose" />
              Редактировать момент
            </DialogTitle>
          </DialogHeader>
          <MomentForm onSubmit={handleEditMoment} submitText="Сохранить изменения" />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="AlertTriangle" size={24} className="text-destructive" />
              Удалить момент?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Вы уверены, что хотите удалить это воспоминание? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMoment} className="bg-destructive hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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