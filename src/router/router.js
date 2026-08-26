export class Router {
  #routes = new Map();
  #publicRoutes = new Set(["/login", "/signin"]);
  #currentPage = null;
  #authService;
  #currentLayoutType = null;
  #outlet = null;
  constructor(authService) {
    this.#authService = authService;
    window.addEventListener("hashchange", () => this.navigate);
  }
  register(path, pageFactory, { public: isPublic = false } = {}) {
    this.#routes.set(path, pageFactory);
    if (isPublic) this.#publicRoutes.add(path);
    return this;
  }
  async navigate() {
    const path = location.hash.slice(1) || "/dashboard";
    const basePath = path.split("/").slice(0, 2).join("/");
    const isPublicRoute = this.#publicRoutes.has(basePath);
    const isAuth = this.#authService.isAuthenticated();
    if (!isPublicRoute && !isAuth) {
      location.hash = "/login";
      return;
    }
    if (isPublicRoute && isAuth) {
      location.hash = "/dashboard";
      return;
    }
    const neededLayout = isPublicRoute ? "auth" : "app";
    if (neededLayout !== this.#currentLayoutType) {
      this.#outlet =
        neededLayout === "auth"
          ? renderAuthLayout()
          : renderApplicationLayout();
      this.#currentPage = null;
    }
    const factory = this.#routes.get(basePath);
    if (this.#currentPage) {
      this.#currentPage.destroy();
    }
    if (!factory) {
      this.#outlet.innerHTML = '<div class="card">404</div>';
      return;
    }
    this.#currentPage = factory(this.#outlet, path);
    await this.#currentPage.render();
  }
  start() {
    this.navigate();
  }
}
