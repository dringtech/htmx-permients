import lume from "lume/mod.ts";
import base_path from "lume/plugins/base_path.ts";
import metas from "lume/plugins/metas.ts";
import minify_html from "lume/plugins/minify_html.ts";
import postcss from "lume/plugins/postcss.ts";

const site = lume();

site.use(base_path());
site.use(metas());
site.use(minify_html());
site.use(postcss());

site.copy('toot-thread');

export default site;
