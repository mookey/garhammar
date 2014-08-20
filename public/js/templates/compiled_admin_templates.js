define(['handlebars'], function (Handlebars) {
var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['_admin_blog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "_blog.html";
  });

templates['_admin_login'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "class=\"error js-error\"";
  }

  buffer += "<div class=\"login js-component\" data-component=\"admin/login\" data-template=\"_admin_login\">\n  <div class=\"row\">\n    <div class=\"col\">\n      <h1>Login</h1>\n      <div class=\"top-10\"> \n        ";
  stack1 = self.invokePartial(partials._alert, '_alert', (depth0 && depth0.alert), helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n      <form\n        method=\"post\"\n        action=\"/admin/login\"\n        enctype=\"multipart/form-data\"\n      >\n        <div class=\"input\">\n          <label>Username:<br/>\n            <input type=\"text\" name=\"username\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fields)),stack1 == null || stack1 === false ? stack1 : stack1.username)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.username), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n            ";
  stack1 = self.invokePartial(partials._tooltip_error, '_tooltip_error', ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.username), helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </label>\n        </div>\n        <div class=\"input top-10\">\n          <label>Password:<br/>\n            <input type=\"password\" name=\"password\">\n          </label>\n        </div>\n        <div class=\"top-10\">\n          <input type=\"submit\" class=\"button\" value=\"Send\">\n        </div>\n      </form>\n    </div>\n  </div>\n</div>";
  return buffer;
  });

templates['_admin_pic'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n            <li>\n              <span class=\"tag right-10\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span><a href=\"/admin/pic/"
    + escapeExpression(((stack1 = (depth1 && depth1._id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/removeTag\" class=\"icon icon-minus js-remove-tag\"></a>\n            </li>\n          ";
  return buffer;
  }

  buffer += "  <div class=\"placeholder js-component\" data-component=\"admin/pics/pic\" data-template=\"_admin_pic\" data-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    <form\n      action=\"/admin/pic/";
  if (helper = helpers._id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0._id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"\n      method=\"post\"\n    >\n      <input type=\"hidden\" name=\"filename\" value=\"";
  if (helper = helpers.filename) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.filename); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/>\n      <input type=\"hidden\" name=\"no\" value=\"";
  if (helper = helpers.no) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.no); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/>\n      <input type=\"hidden\" name=\"width\" value=\"";
  if (helper = helpers.width) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.width); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/>\n      <input type=\"hidden\" name=\"height\" value=\"";
  if (helper = helpers.height) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.height); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/>\n\n      ";
  stack1 = self.invokePartial(partials._alert, '_alert', (depth0 && depth0.alert), helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <img width=\"";
  if (helper = helpers.width) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.width); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" height=\"";
  if (helper = helpers.height) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.height); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"spinner\" src=\"/img/dist/ajax-loader.gif\" alt=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-echo=\"/img/dist/";
  if (helper = helpers.filename) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.filename); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-no=\"";
  if (helper = helpers.no) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.no); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n      <div class=\"top-10 input\">\n        Name:<br/>\n        <input type=\"text\" name=\"name\" value=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"> \n      </div>\n      <div class=\"top-10 input\">\n        Date:<br/>\n        <input class=\"js-datepicker\" type=\"text\" name=\"dateTaken\" value=\"";
  if (helper = helpers.dateTaken) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dateTaken); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"> \n      </div>\n      <div class=\"top-10 input\">\n        Description:<br/>\n        <textarea name=\"desc\">";
  if (helper = helpers.desc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.desc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n      </div>\n      <div class=\"top-10 input\">\n        Add tag:<br/>\n        <input class=\"tag-input right-10 js-add-tag-input\" type=\"text\" name=\"addTag\"/><a href=\"/admin/pic/";
  if (helper = helpers._id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0._id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/addTag\" class=\"icon icon-plus js-add-tag\"></a>\n        <ul class=\"tags js-tags\">\n          ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.tags), {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n      </div>\n      <div class=\"top-20\">\n        <input type=\"submit\" value=\"Update\">\n      </div>\n    </form>\n  </div>";
  return buffer;
  });

templates['_admin_pic_tabs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Pictures</h1>\n\n<div class=\"top-20 tabs js-tabs-wrapper js-component\" data-component=\"tabs\">\n  <ul class=\"tabs-large nav-two\">\n      <li>\n          <a class=\"js-tabs-link js-tabs-link-large\" href=\"\" data-runtime-template=\"_admin_pics_upload\" data-content-id=\"0\">Upload</a>\n      </li><li>\n          <a class=\"active js-active js-tabs-link js-tabs-link-large\" href=\"\" data-runtime-template=\"_admin_pics_info\" data-content-id=\"1\">Info</a>\n      </li>\n  </ul>\n  <a class=\"tab js-tabs-link\" href=\"\" data-runtime-template=\"_admin_pics_upload\" data-content-id=\"0\">Upload<span class=\"pull-right icon icon-arrow-up\"></span></a>\n  <div class=\"hide tabs-content tabs-content-last js-tabs-content\">\n    <div class=\"spinner\"></div>\n  </div>\n\n  <a class=\"tab active js-active js-tabs-link\" href=\"\" data-runtime-template=\"_admin_pics_info\" data-content-id=\"1\">Info<span class=\"pull-right icon icon-arrow-down\"></span></a>  \n  <div class=\"tabs-content js-tabs-content\">\n    <div class=\"spinner\"></div>\n  </div>\n  \n\n</div>\n";
  });

templates['_admin_pics'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = self.invokePartial(partials._admin_pic, '_admin_pic', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, (depth0 && depth0.pictures), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

templates['_admin_pics_info'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"pics js-component\" data-component=\"admin/pics/pics\" data-template=\"_admin_pics\">\n  <div class=\"js-pics\">\n  </div>\n</div>";
  });

templates['_admin_pics_upload'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "class=\"error js-error\"";
  }

  buffer += "<div class=\"js-component\" data-component=\"admin/pics/upload\" data-template=\"_admin_pics_upload\">\n  <div class=\"row\">\n    <div class=\"col\">\n      <h2>Upload</h2>\n      <div class=\"top-20\"> \n        ";
  stack1 = self.invokePartial(partials._alert, '_alert', (depth0 && depth0.alert), helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n      <form\n        method=\"post\"\n        action=\"/admin/pics/upload\"\n        enctype=\"multipart/form-data\"\n      >\n        <div class=\"input\">\n          <label>File:<br/>\n            <input type=\"file\" name=\"name\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fields)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.name), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n            ";
  stack1 = self.invokePartial(partials._tooltip_error, '_tooltip_error', ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.name), helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </label>\n        </div>\n        <div class=\"top-20\">\n          <input type=\"submit\" class=\"button\" value=\"Upload\">\n        </div>\n      </form>\n    </div>\n  </div>\n</div>";
  return buffer;
  });

templates['_admin_users'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Users</h1>\n\n<div class=\"top-20 tabs js-tabs-wrapper js-component\" data-component=\"tabs\">\n  <ul class=\"tabs-large nav-two\">\n      <li>\n          <a class=\"active js-active js-tabs-link js-tabs-link-large\" href=\"\" data-runtime-template=\"_admin_users_create\" data-content-id=\"0\">Create</a>\n      </li><li>\n          <a class=\"js-tabs-link js-tabs-link-large\" href=\"\" data-runtime-template=\"_admin_users_update\" data-content-id=\"1\">Update</a>\n      </li>\n  </ul>\n\n  <a class=\"tab active js-active js-tabs-link\" href=\"\" data-runtime-template=\"_admin_users_create\" data-content-id=\"0\">Create<span class=\"pull-right icon icon-arrow-down\"></span></a>  \n  <div class=\"tabs-content js-tabs-content\">\n    <div class=\"spinner\"></div>\n  </div>\n  \n  <a class=\"tab js-tabs-link\" href=\"\" data-runtime-template=\"_admin_users_update\" data-content-id=\"1\">Update<span class=\"pull-right icon icon-arrow-up\"></span></a>\n  <div class=\"hide tabs-content tabs-content-last js-tabs-content\">\n    <div class=\"spinner\"></div>\n  </div>\n\n</div>\n";
  });

templates['_admin_users_create'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "class=\"error js-error\"";
  }

  buffer += "<div class=\"js-component\" data-component=\"admin/users/create\" data-template=\"_admin_users_create\">\n  <div class=\"row\">\n    <div class=\"col\">\n      <h2>Create</h2>\n      <div class=\"top-20\"> \n        ";
  stack1 = self.invokePartial(partials._alert, '_alert', (depth0 && depth0.alert), helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n      <form\n        method=\"post\"\n        action=\"/admin/users/create\"\n        enctype=\"multipart/form-data\"\n      >\n        <div class=\"input\">\n          <label>Username:<br/>\n            <input type=\"text\" name=\"username\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fields)),stack1 == null || stack1 === false ? stack1 : stack1.username)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.username), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n            ";
  stack1 = self.invokePartial(partials._tooltip_error, '_tooltip_error', ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.username), helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </label>\n        </div>\n        <div class=\"input top-10\">\n          <label>Email:<br/>\n            <input type=\"text\" name=\"email\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fields)),stack1 == null || stack1 === false ? stack1 : stack1.email)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.email), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n            ";
  stack1 = self.invokePartial(partials._tooltip_error, '_tooltip_error', ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.email), helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </label>\n        </div>\n        <div class=\"input top-10\">\n          <label>Password:<br/>\n            <input type=\"password\" name=\"password\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fields)),stack1 == null || stack1 === false ? stack1 : stack1.password)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.password), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n            ";
  stack1 = self.invokePartial(partials._tooltip_error, '_tooltip_error', ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.password), helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </label>\n        </div>\n        <div class=\"input top-10\">\n          <label>Confirm password:<br/>\n            <input type=\"password\" name=\"confirm_password\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.fields)),stack1 == null || stack1 === false ? stack1 : stack1.confirm_password)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.confirm_password), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n            ";
  stack1 = self.invokePartial(partials._tooltip_error, '_tooltip_error', ((stack1 = (depth0 && depth0.errors)),stack1 == null || stack1 === false ? stack1 : stack1.confirm_password), helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </label>\n        </div>\n        <h3>Rights</h3>\n        <div class=\"input top-10\">\n          <label>\n            <input type=\"radio\" name=\"permission\" value=\"0\" checked=\"checked\"/> regular\n          </label>\n          <br/>\n          <label>\n            <input type=\"radio\" name=\"permission\" value=\"10\" /> admin\n          </label>\n          <br/>\n        </div>\n        <div class=\"top-20\">\n          <input type=\"submit\" class=\"button\" value=\"Create\">\n        </div>\n      </form>\n    </div>\n  </div>\n</div>";
  return buffer;
  });

templates['_admin_users_update'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "_admin_users_update.html";
  });

templates['_alert'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "error";
  }

function program3(depth0,data) {
  
  
  return "hide";
  }

  buffer += "<div class=\"alert js-close-wrapper ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isError), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.message), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n  <span class=\"mark icon icon-check\"></span>\n  <span class=\"alert-text js-alert-text\">";
  if (helper = helpers.message) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.message); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n  <a href=\"\" class=\"icon icon-cross js-close\"></a>\n</div>\n";
  return buffer;
  });

templates['_tooltip_error'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n  <div class=\"abs-error js-abs-error\">\n    <div class=\"abs-error-message\">";
  if (helper = helpers.message) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.message); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n    <svg class=\"abs-error-arrow\">\n      <path d=\"M 2 29 L 2 38\"></path>\n      <path d=\"M 1 38 L 11 38\"></path>\n      <path d=\"M 2 8 Q 22 23 2 38\"></path>\n    </svg>\n  </div>\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.message), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
});