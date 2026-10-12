import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MATERIAL_CATALOG, materialPageUrl } from '../shared/materials';
import { validateMaterialContent } from '../shared/materialKit';

test('115-MI 只發布兩份核可教材，HTML、來源、SDK與目錄分母一致', () => {
  const slugs=['micro-bacteria-review','immuno-concepts-review'], ids=new Set<string>();
  assert.deepEqual(Object.keys(MATERIAL_CATALOG),slugs.map(s=>s+'-v1'));
  assert.deepEqual(fs.readdirSync('public/materials').sort(),['README.md','course-learning.js',...slugs.map(s=>s+'-v1')].sort());
  const kit=fs.readFileSync('materials-src/kit/kit.js','utf8').replace(/^export /gm,'');
  const readme=fs.readFileSync('public/materials/README.md','utf8');
  for(const slug of slugs){
    const html=fs.readFileSync(`public/materials/${slug}-v1/index.html`,'utf8');
    const start=html.lastIndexOf('\nmount(')+'\nmount('.length;
    assert(start>6);let quoted=false,escaped=false,depth=0,end=start;
    for(;end<html.length;end++){
      const c=html[end];
      if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;}
      else if(c==='"')quoted=true;else if(c==='{'||c==='[')depth++;else if((c==='}'||c===']')&&--depth===0){end++;break;}
    }
    const content=JSON.parse(html.slice(start,end));validateMaterialContent(content);
    assert.deepEqual(content,JSON.parse(fs.readFileSync(`materials-src/${slug}/content.json`,'utf8')));
    assert.equal(content.nodes.length,slug==='micro-bacteria-review'?6:8);
    assert.equal(content.foundation.length,6);assert.equal(content.cases.length,5);
    const catalog=MATERIAL_CATALOG[slug+'-v1'];
    assert.equal(catalog.nodeTotal,content.nodes.length);assert.equal(catalog.questionTotal,11);
    assert.equal(catalog.label,content.label);assert.equal(catalog.tracking,'interactive');
    assert(html.includes(kit.slice(kit.indexOf('  // 兩關題目'))));assert(readme.includes(slug+'-v1'));
    assert(html.includes('<script src="https://albertchang1008-alt.github.io/115-MI/materials/course-learning.js"></script>'));
    assert.equal(materialPageUrl(slug+'-v1'),`https://albertchang1008-alt.github.io/115-MI/materials/${slug}-v1/index.html`);
    const rows=[...content.nodes,...content.foundation,...content.cases];
    assert.deepEqual(rows.map(r=>r.id).sort(),html.match(/name="material-ids" content="([^"]+)"/)![1].split(',').sort());
    for(const row of rows){assert(!ids.has(row.id));ids.add(row.id);}
  }
  assert.equal(ids.size,36);
  for(const n of ['CHP07_immune_infographic.html','CHP08_hypersensitivity_infographic.html','CHP16_mycology_infographic.html'])assert(fs.existsSync('public/'+n));
});
