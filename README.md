Shader.js [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/ILOVEPIE/Shader.js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ILOVEPIE/Shader.js/context:javascript)
==========================================================================================================================================================================================================

A small and compact closure-compiler compatible JavaScript library for managing shaders.

Features:
---------

 - shader source caching (speeds up compilation of multiple identical shaders)
 - persistent shader source caching (expiration required for this to be used)
 - uniform management (simplifies uniforms to make them easier to use, reducing the amount of typing required, 1 method will update all types of uniforms.)
 - simplifies rendering code by compacting code that is always required to use a shader into one method

Usage:
------

To create a shader:

    var shader = Object.create(window.ShaderPrototype);

Loading a shader(temporary caching):

    var vertexShaderUrl = "http://www.example.com/shaders/vertex_shader.glsl";
    var fragmentShaderUrl = "http://www.example.com/shaders/fragment_shader.glsl";
    shader.load(vertexShaderUrl,fragmentShaderUrl);

Loading a shader(persistent caching):

    var vertexShaderUrl = "http://www.example.com/shaders/vertex_shader.glsl";
    var fragmentShaderUrl = "http://www.example.com/shaders/fragment_shader.glsl";
    shader.load(vertexShaderUrl,fragmentShaderUrl,3);// load the shaders and cache them for 3 days (fractional days are allowed)

Compiling a loaded shader:

    var ctx = document.getElementById("canvas").getContext("webgl");	
    shader.compile(ctx);

Setting up uniforms:

    shader.addOption(uniformVariableName,defaultValue,type*);

  *see the uniform type mapping below

Updating uniforms:

    shader.updateOption(uniformVariableName,newValue);

Updating other variable types:

  To update variables that are not uniforms you need to use the actual shader program object, this is available by calling:

    shader.getShader();

Using the shader:

    shader.bindShader(ctx);
    //your rendering code goes here

Uniform Type Mapping:

  The mappings follow a simple rule, take the method that you would normally use to change it and strip off the beginning "uniform" in it's name

  Example:

    ctx.uniformMatrix2fv() -> "Matrix2fv"
    ctx.uniform4f() -> "4f"
