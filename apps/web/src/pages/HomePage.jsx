import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Gestor de Tareas</title>
        <meta name="description" content="Sistema de gestión de tareas. Organiza y realiza seguimiento de todas tus tareas diarias, semanales y mensuales." />
      </Helmet>
      
      <div className="min-h-screen bg-background pb-24">
        {/* El contenedor sticky asegura que el Header tenga visibilidad y formato consistente con las otras páginas */}
        <div className="sticky top-0 z-40 bg-popover border-b border-border shadow-sm">
          <div className="px-3 py-4">
            <Header title="Inicio" />
          </div>
        </div>
        
        <main className="px-3 py-4 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <h2 className="text-[18px] font-heading font-bold text-foreground mb-3">Bienvenido a Gestor de Tareas</h2>
              <p className="text-muted-foreground mb-6 leading-normal text-[13px]">
                Gestiona tus tareas de forma eficiente. Usa la navegación superior para acceder rápidamente a tus tareas de hoy, esta semana o ver todas las tareas disponibles.
              </p>
              
              <div className="grid gap-3 md:grid-cols-2">
                <div className="bg-popover rounded-xl p-4 border border-border hover:border-primary/50 transition-colors duration-200">
                  <h3 className="font-heading font-semibold text-foreground mb-1.5 text-[14px]">Tareas diarias</h3>
                  <p className="text-[12px] text-muted-foreground leading-normal">
                    Revisa y completa tus tareas diarias. El check se reinicia automáticamente cada día a las 00:00.
                  </p>
                </div>
                
                <div className="bg-popover rounded-xl p-4 border border-border hover:border-primary/50 transition-colors duration-200">
                  <h3 className="font-heading font-semibold text-foreground mb-1.5 text-[14px]">Tareas semanales</h3>
                  <p className="text-[12px] text-muted-foreground leading-normal">
                    Organiza tus tareas por día de la semana. El check se reinicia cada lunes a las 00:00.
                  </p>
                </div>
                
                <div className="bg-popover rounded-xl p-4 border border-border hover:border-primary/50 transition-colors duration-200">
                  <h3 className="font-heading font-semibold text-foreground mb-1.5 text-[14px]">Todas las tareas</h3>
                  <p className="text-[12px] text-muted-foreground leading-normal">
                    Vista completa con filtros por categoría, frecuencia y prioridad. Cambia entre vista de lista y Kanban.
                  </p>
                </div>
                
                <div className="bg-popover rounded-xl p-4 border border-border hover:border-primary/50 transition-colors duration-200">
                  <h3 className="font-heading font-semibold text-foreground mb-1.5 text-[14px]">Rutinas</h3>
                  <p className="text-[12px] text-muted-foreground leading-normal">
                    Gestiona tus rutinas semanales y mensuales con recordatorios de día y hora sugeridos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;