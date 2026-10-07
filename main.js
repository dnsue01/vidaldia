(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const nav = $("#nav");
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px";
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => nav.classList.toggle("is-stuck", !e.isIntersecting)).observe(sentinel);

  const burger = $("#burger");
  const menu = $("#menu");
  const setMenu = open => {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  const rail = $("#rail");
  const step = () => rail.firstElementChild.getBoundingClientRect().width + 16;
  $(".rail-ctl .prev").addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: "smooth" }));
  $(".rail-ctl .next").addEventListener("click", () => rail.scrollBy({ left: step(), behavior: "smooth" }));

  const form = $("#form");
  const rules = {
    nombre: v => v.trim().length > 1,
    ok: (_, el) => el.checked
  };
  const check = el => {
    const good = rules[el.name](el.value, el);
    el.closest(".field").classList.toggle("bad", !good);
    el.setAttribute("aria-invalid", !good);
    return good;
  };
  Object.keys(rules).forEach(n => {
    const el = form.elements[n];
    el.addEventListener("blur", () => check(el));
    el.addEventListener("input", () => { if (el.closest(".field").classList.contains("bad")) check(el); });
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const results = Object.keys(rules).map(n => check(form.elements[n]));
    if (results.includes(false)) { form.querySelector(".bad input")?.focus(); return; }
    const f = form.elements;
    const extra = f.msg.value.trim();
    const text = `Hola, soy ${f.nombre.value.trim()}. Me gustaría pedir cita: ${f.motivo.value}.${extra ? "\n" + extra : ""}`;
    $("#done").classList.add("show");
    window.open(`https://wa.me/34606279234?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });
})();
