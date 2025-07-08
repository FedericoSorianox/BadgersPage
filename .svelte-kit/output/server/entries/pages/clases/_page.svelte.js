import { c as create_ssr_component, d as each, a as add_attribute, e as escape } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const classes = [
    {
      name: "Jiu Jitsu con GI",
      description: "Clases de Jiu Jitsu con el uniforme tradicional (Gi). Aprende técnicas de agarre, derribos y sumisiones. Todos los niveles desde principiantes hasta avanzados.",
      img: "https://via.placeholder.com/600x400?text=Jiu-Jitsu"
    },
    {
      name: "Muay Thai",
      // Reemplaza con una imagen real
      description: "El arte marcial mas completo de combate de pie. Las clases estan diseñadas para todos los niveles, desde principiantes hasta avanzados. Entrenamos y estudiamos a detalle el arte del combate.",
      img: "https://via.placeholder.com/600x400?text=Muay+Thai"
    },
    {
      name: "Jiu Jitsu No Gi",
      // Reemplaza con una imagen real
      description: "No necesitas el Gi para estas clases. Enfocadas en técnicas de agarre y sumisiones sin el uniforme tradicional. Ideal para quienes buscan una experiencia más dinámica y rápida. ",
      img: "https://via.placeholder.com/600x400?text=Kids+MMA"
    }
  ];
  const scheduleData = [
    {
      hora: "07:30 - 08:30",
      lunes: "Muay thai",
      martes: "Jiu Jitsu GI",
      miercoles: "Muay Thai",
      jueves: "Jiu Jitsu GI",
      viernes: "",
      sabado: "Open Mat 10.30 AM"
    },
    {
      hora: "11:30 - 12:30",
      lunes: "Jiu Jitsu GI",
      martes: "",
      miercoles: "Jiu Jitsu GI",
      jueves: "",
      viernes: "",
      sabado: ""
    },
    {
      hora: "19:00 - 20:00",
      lunes: "Muay Thai",
      martes: "Jiu Jitsu No GI",
      miercoles: "Muay Thai",
      jueves: "Jiu Jitsu No Gi",
      viernes: "Libre/Repaso Muay Thai",
      sabado: ""
    },
    {
      hora: "20:00 - 21:00",
      lunes: "Jiu Jitsu GI",
      martes: "Muay Thai",
      miercoles: "Jiu Jitsu No Gi",
      jueves: "Muay Thai",
      viernes: "Libre/Repaso Jiu Jitsu",
      sabado: ""
    }
  ];
  return `<div class="container mx-auto px-4 py-16"><div class="text-center mb-16" data-svelte-h="svelte-b3uvh6"><h1 class="text-4xl md:text-5xl font-extrabold">Nuestras <span class="text-badger-accent">Disciplinas</span></h1> <p class="text-lg text-gray-600 mt-2">Encuentra tu camino en el tatami.</p></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">${each(classes, (martialArt) => {
    return `<div class="bg-white rounded-lg shadow-lg overflow-hidden text-center border"><img${add_attribute("src", martialArt.img, 0)}${add_attribute("alt", martialArt.name, 0)} class="w-full h-48 object-cover"> <div class="p-6"><h3 class="text-2xl font-bold mb-2 text-badger-dark">${escape(martialArt.name)}</h3> <p class="text-gray-700">${escape(martialArt.description)}</p></div> </div>`;
  })}</div> <div class="text-center mb-12" data-svelte-h="svelte-ha053l"><h2 class="text-4xl md:text-5xl font-extrabold">Horario <span class="text-badger-accent">Semanal</span></h2> <p class="text-lg text-gray-600 mt-2">Planifica tu entrenamiento.</p></div> <div class="overflow-x-auto bg-white rounded-lg shadow-xl border"><table class="w-full text-sm text-left text-gray-700"><thead class="text-xs text-badger-dark uppercase bg-gray-200" data-svelte-h="svelte-1gdkvea"><tr><th scope="col" class="px-6 py-3">Hora</th> <th scope="col" class="px-6 py-3">Lunes</th> <th scope="col" class="px-6 py-3">Martes</th> <th scope="col" class="px-6 py-3">Miércoles</th> <th scope="col" class="px-6 py-3">Jueves</th> <th scope="col" class="px-6 py-3">Viernes</th> <th scope="col" class="px-6 py-3">Sábado</th></tr></thead> <tbody>${each(scheduleData, (row, i) => {
    return `<tr class="${"border-b " + escape(i % 2 === 0 ? "bg-white" : "bg-gray-50", true)}"><th scope="row" class="px-6 py-4 font-bold text-badger-dark whitespace-nowrap">${escape(row.hora)}</th> <td class="px-6 py-4">${escape(row.lunes)}</td> <td class="px-6 py-4">${escape(row.martes)}</td> <td class="px-6 py-4">${escape(row.miercoles)}</td> <td class="px-6 py-4">${escape(row.jueves)}</td> <td class="px-6 py-4">${escape(row.viernes)}</td> <td class="px-6 py-4">${escape(row.sabado)}</td> </tr>`;
  })}</tbody></table></div></div>`;
});
export {
  Page as default
};
